import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId, // Refers to a subdocument in event.schedules
        required: true,
    },
    seats: [{
        type: String, 
        required: true,
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String, 
        enum: ["confirmed", "cancelled"],
        default: "confirmed",
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;