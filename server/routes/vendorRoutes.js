import express from "express";
import { protect, vendorOnly } from "../middleware/authMiddleware.js";
import { createEvent, deleteEvent, editEvent, viewBookings, viewEvent, viewEventBookings, viewMyEvents, } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/events/", protect, vendorOnly, viewMyEvents);
router.get("/events/:eventId", protect, vendorOnly, viewEvent);
router.post("/events/create", protect, vendorOnly, createEvent);
router.put("/events/update/:eventId", protect, vendorOnly, editEvent)
router.delete("/events/delete/:eventId", protect, vendorOnly, deleteEvent)
router.get("/bookings", protect, vendorOnly, viewBookings)
router.get("/bookings/:eventId", protect, vendorOnly, viewEventBookings)

export default router;

