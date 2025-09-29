import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";

export const createEvent = async(req, res) => {
    try {
        const {
            title,
            category,
            description,
            location,
            source,
            destination,
            price,
            totalSeats,
            schedules // Each: { date, time, totalSeats }
        } = req.body;

        // Basic validation based on category
        if (category === "train" && (!source || !destination))
        return res.status(400).json({ message: "Train events require source and destination." });

        if ((category === "movie" || category === "concert") && !location)
        return res.status(400).json({ message: "Movies and concerts require a location." });

        // Validate schedules
        if (!Array.isArray(schedules) || schedules.length === 0)
            return res.status(400).json({ message: "At least one schedule is required." });

        const formattedSchedules = schedules.map(({ date, time, totalSeats }) => {
        const seats = Array.from({ length: totalSeats }, (_, i) => ({
            seatNumber: `S${i + 1}`,
            status: "available",
            userId: null
        }));

        return {
            date,
            time,
            totalSeats,
            seats
        };
        });
        const newEvent = await Event.create({
            title,
            category,
            description,
            location: location || null,
            source: source || null,
            destination: destination || null,
            price,
            schedules: formattedSchedules,
            vendorId: req.account._id
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: newEvent
        });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const editEvent = async(req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findOne({ _id: eventId, vendorId: req.account._id });

        if (!event) 
            return res.status(404).json({ message: "Event not found or not owned by vendor" });

        const hasBookings = event.schedules.some(schedule =>
        schedule.seats.some(seat => seat.status === "booked")
        );
        
        const {
            title,
            description,
            location,
            source,
            destination,
            price,
            schedules,
        } = req.body;

        if (hasBookings) {
            // Only allow adding new schedules
            if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
                return res.status(400).json({ message: "Bookings exist. Only new schedules can be added." });
            }

            const newSchedules = schedules.map(({ date, time, totalSeats }) => {
                const seats = Array.from({ length: totalSeats }, (_, i) => ({
                seatNumber: `S${i + 1}`,
                status: "available",
                userId: null
                }));
                return { date, time, totalSeats, seats };
            });

            event.schedules.push(...newSchedules);
        } else {
            // Full editing allowed
            if (title) event.title = title;
            if (description) event.description = description;
            if (price !== undefined) event.price = price;

            if (event.category === "train") {
                if (source) event.source = source;
                if (destination) event.destination = destination;
            } else {
                if (location) event.location = location;
            }

            if (Array.isArray(schedules)) {
                const updatedSchedules = schedules.map(({ date, time, totalSeats }) => {
                const seats = Array.from({ length: totalSeats }, (_, i) => ({
                    seatNumber: `S${i + 1}`,
                    status: "available",
                    userId: null
                }));
                return { date, time, totalSeats, seats };
                });
                event.schedules = updatedSchedules;
            }
            }

        await event.save();
        res.status(200).json({
            success: true,
            message: hasBookings
                ? "New schedule(s) added to event with active bookings"
                : "Event updated successfully",
            event
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findOne({ _id: eventId, vendorId: req.account._id });

        if (!event)
            return res.status(404).json({ message: "Event not found or not owned by vendor" });

        const hasBookings = event.schedules.some(schedule =>
            schedule.seats.some(seat => seat.status === "booked")
        );

        if (hasBookings)
            return res.status(400).json({ message: "Cannot delete event with active bookings" });

        await Event.deleteOne({ _id: eventId });

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const viewMyEvents = async (req, res) => {
    try {
        const vendorId = req.account._id;

        const events = await Event.find({ vendorId });

        res.status(200).json({
            success: true,
            message: "Fetched vendor events successfully",
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const viewEvent = async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const viewBookings = async (req, res) => {
    try {
        const vendorId = req.account._id;

        // Get events by this vendor
        const vendorEvents = await Event.find({ vendorId }, "_id title");
        const eventIds = vendorEvents.map(event => event._id);

        // Get bookings for these events
        const bookings = await Booking.find({ eventId: { $in: eventIds } })
        .populate("eventId", "title category")
        .populate("schedule", "date time")
        .populate("userId", "name email");

        res.status(200).json({
        success: true,
        message: "Vendor bookings fetched successfully",
        count: bookings.length,
        bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const viewEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.vendorId.toString() !== req.account._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to view bookings for this event." });
    }

    const bookings = await Booking.find({ eventId }).populate("userId", "name email");

    const enrichedBookings = bookings.map((booking) => {
      const schedule = event.schedules.id(booking.schedule);
      return {
        ...booking._doc,
        schedule: schedule
          ? {
              date: schedule.date,
              time: schedule.time
            }
          : null
      };
    });

    res.status(200).json({
      success: true,
      eventTitle: event.title,
      bookings: enrichedBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


