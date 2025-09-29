import express from "express";
import { protect, userOnly } from "../middleware/authMiddleware.js";
import { bookEvent, deleteBooking, viewBookings, viewEvent, viewAllEvents, viewTicket } from "../controllers/userController.js";

const router = express.Router();

router.get("/events/", protect, userOnly, viewAllEvents);
router.get("/events/:eventId", protect, userOnly, viewEvent);
router.post("/bookings/", protect, userOnly, bookEvent);
router.get("/bookings/me", protect, userOnly, viewBookings);
router.get("/bookings/:bookingId", protect, userOnly, viewTicket);
router.delete("/bookings/cancel-booking/:bookingId", protect, userOnly, deleteBooking)

export default router