import express from "express";
import { Register, Login, resetPassword, requestPasswordReset } from "../controllers/authController.js";
import { validateEmailInput } from "../middleware/mailMiddleware.js" 

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/forgot-password", validateEmailInput, requestPasswordReset);
router.put("/reset-password/:token", resetPassword);

export default router;