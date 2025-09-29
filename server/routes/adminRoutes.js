import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { createEvent, deleteEvent, deleteUser, deleteVendor, editEvent, getUserDetails, getUsers, getAdminDashboard, getVendorDetails, getVendors, suspendUser, suspendVendor, unsuspendUser, unsuspendVendor, viewEvent, viewEvents, viewEventsByUser, viewEventsByVendor } from "../controllers/adminController.js";

const router = express.Router();

//Event Routes
router.get("/events/", protect, adminOnly, viewEvents);
router.get("/events/:eventId", protect, adminOnly, viewEvent);
router.post("/events/create", protect, adminOnly, createEvent);
router.put("/events/update/:eventId", protect, adminOnly, editEvent);
router.delete("/events/delete/:eventId", protect, adminOnly, deleteEvent);
router.get("/events/vendor/:vendorId", protect, adminOnly, viewEventsByVendor);
router.get("/events/user/:userId", protect, adminOnly, viewEventsByUser);

//Vendor Routes
router.get("/vendors/", protect, adminOnly, getVendors);
router.get("/vendors/:vendorId", protect, adminOnly, getVendorDetails);
router.patch("/vendors/suspend/:vendorId", protect, adminOnly, suspendVendor);
router.patch("/vendors/unsuspend/:vendorId", protect, adminOnly, unsuspendVendor);
router.delete("/vendors/delete/:vendorId", protect, adminOnly, deleteVendor);

//User Routes
router.get("/users/", protect, adminOnly, getUsers);
router.get("/users/:userId", protect, adminOnly, getUserDetails);
router.patch("/users/suspend/:userId", protect, adminOnly, suspendUser);
router.patch("/users/unsuspend/:userId", protect, adminOnly, unsuspendUser);
router.delete("/users/delete/:userId", protect, adminOnly, deleteUser);

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

export default router;