import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["available", "booked"],
        default: "available",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null,
    },
});

const scheduleSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    totalSeats: { 
        type: Number, 
        required: true 
    },
    seats: [seatSchema], // Optional: if seat-level status is tracked
})

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Movie name, concert title, or train name
    category: {
        type: String,
        enum: ["movie", "concert", "train"],
        required: true
    },
    description: { type: String },
    
    location: { type: String, default: null },
    source: { type: String, default: null, },         // Only for trains
    destination: { type: String, default: null, },    // Only for trains

    price: { type: Number, required: true },

    schedules: {
        type: [scheduleSchema],
        required: true,
    },

    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
},{
    timestamps: true,
});

const Event = mongoose.model("Event", eventSchema);
export default Event;