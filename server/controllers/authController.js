import Account from "../models/accountModel.js";
import { hashPassword, comparePassword } from "../utils/authUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import { hashToken, generateResetToken } from "../utils/tokenUtils.js";
import { getPasswordResetEmailHTML, sendResetPasswordEmail } from "../utils/emailUtils.js";

export const Register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //validation
        if (!name) return res.status(400).json({ error: "Name is required" });
        if (await Account.findOne({ email })) return res.status(400).json({ error: "Email already taken" });
        if (!password || password.length < 7) return res.status(400).json({ error: "Password should be at least 6 characters long"});

        //avoid duplicate emails
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) return res.status(400).json({ error: "Email already registered" });
        
        //hash passwords
        const hashedPassword = await hashPassword(password);

        //ensure only valid roles
        const validRoles = ["user", "vendor", "admin"];
        if (!validRoles.includes(role)) return res.status(400).json({ error: "Invalid role provided" });
        
        //create new account
        const newAccount = await Account.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(200).json({ 
            success: true, 
            message: "Account created successfully!",
            data: newAccount 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const Login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({ error: "email and password are required" });

        const account = await Account.findOne({ email });
        if (!account) return res.status(404).json({ error: "Account not found!" });

        const match = await comparePassword(password, account.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });
        
        if (account.isSuspended) {
            return res.status(403).json({ message: "Account suspended. Please contact admin." });
        }

        res.json({ 
            success: true,
            message: "Login successful!",
            token: generateToken(account._id),
            account,
        });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const requestPasswordReset = async(req, res) => {
    try {
        const { email } = req.body;
        const account = await Account.findOne({ email });

        if (!account) return res.status(404).json({ error: "Account not found!" });

        const {rawToken, hashedToken} = generateResetToken();

        account.resetPasswordToken = hashedToken;
        account.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
        await account.save();

        const resetURL = `http://localhost:5173/auth/reset-password/${rawToken}`;
        const html = getPasswordResetEmailHTML(resetURL);
        await sendResetPasswordEmail(email, html);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}

export const resetPassword = async(req, res) => {
    try{
        const { token } = req.params;
        const { newPassword, confirmNewPassword } = req.body;
        const hashedToken = hashToken(token);

        const account = await Account.findOne({ 
            resetPasswordToken: hashedToken, 
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!account) return res.status(400).json({ message: 'Invalid or expired token' });
        if (newPassword !== confirmNewPassword) return res.status(400).json({ message: "New passwords do not match" });

        const hashedPassword = await hashPassword(newPassword);
        account.password = hashedPassword;
        account.resetPasswordToken = undefined;
        account.resetPasswordExpiry = undefined;
        
        await account.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch(error) {
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
}