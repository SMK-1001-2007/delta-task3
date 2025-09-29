import Account from "../models/accountModel.js";
import { hashPassword, comparePassword } from "../utils/authUtils.js";
import { deleteFromCloudinary } from "../middleware/cloudinaryMiddleware.js";

export const getProfile = async(req, res) => {
    res.json(req.account);
}

export const changePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        //Basic validation
        if (!oldPassword || !newPassword || !confirmNewPassword)
            return res.status(400).json({ message: "All fields are required" });
        if (newPassword !== confirmNewPassword)
            return res.status(400).json({ message: "New passwords do not match" });

        const account = await Account.findById(req.account.id);
        if (!account) return res.status(404).json({ message: "Account not found" });

        const isMatch = await comparePassword(oldPassword, account.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        account.password = await hashPassword(newPassword);
        await account.save();
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const editProfile = async(req, res) => {
    try {
        const account = await Account.findById(req.account.id);
        if (!account) return res.status(404).json({ message: "Account not found" });

        const {name, email} = req.body;
        if (name) account.name = name;
        if (email) account.email = email;

        await account.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            name: account.name,
            email: account.email,
        })
    } catch(error) {
        res.status(500).json({ sucesss: false, message: error.message });
    }
}

export const uploadProfilePic = async(req, res) => {
    try {
        const account = await Account.findById(req.account.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        // The image URL will be available in req.file.path
        account.profilePic = req.file.path;
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePic: account.profilePic,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const removeProfilePic = async(req, res) => {
    try {
        const account = await Account.findById(req.account.id);

        if (!account) return res.status(404).json({ message: 'Account not found' });
        if (!account.profilePic) return res.status(400).json({ message: 'No profile picture to remove' });

        const deleted = await deleteFromCloudinary(account.profilePic);
        if (!deleted) return res.status(500).json({ message: 'Failed to remove image from Cloudinary' });
        
        account.profilePic = '';
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture removed successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProfilePic = async(req, res) => {
    try {
        const account = await Account.findById(req.account.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        if (account.profilePic) await deleteFromCloudinary(account.profilePic);

        account.profilePic = req.file.path; // new Cloudinary URL
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePic: account.profilePic,
        });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
}