import express from "express";
import { getProfile, changePassword, editProfile, uploadProfilePic, removeProfilePic, updateProfilePic } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinaryMiddleware.js"

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/edit-profile", protect, editProfile);
router.put("/change-password", protect, changePassword);
router.post("/upload-profile-picture", protect, upload.single("profilePic"), uploadProfilePic);
router.delete("/remove-profile-picture", protect, removeProfilePic);
router.put("/update-profile-picture", protect, upload.single("profilePic"), updateProfilePic);

export default router;