import jwt from "jsonwebtoken";
import Account from "../models/accountModel.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.account = await Account.findById(decoded.id).select("-password");

        if (!req.account) {
            return res.status(401).json({ message: "Account not found" });
        }

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Authorization failed" });
    }
};

export const userOnly = (req, res, next) => {
    try {
        if (!req.account || req.account.role !== "user") {
        return res.status(403).json({ message: "Access denied: Users only" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization error", error: error.message });
    }
};

export const vendorOnly = (req, res, next) => {
    try {
        if (!req.account || req.account.role !== "vendor") {
        return res.status(403).json({ message: "Access denied: Vendors only" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization error", error: error.message });
    }
};

export const adminOnly = (req, res, next) => {
    try {
        if (!req.account || req.account.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization error", error: error.message });
    }
};
