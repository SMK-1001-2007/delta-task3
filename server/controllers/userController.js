import Account from "../models/accountModel.js";
import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";


export const viewAllEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const currentDate = new Date();

    const query = {};
    if (category) query.category = category;

    const allEvents = await Event.find(query);

    const upcomingEvents = allEvents
      .map(event => {
        const futureSchedules = event.schedules.filter(sch => {
          const { date, time } = sch;

          if (!date || !time) {
            console.warn(`Skipping schedule with missing date/time:`, sch);
            return false;
          }

          const dateStr = new Date(date).toISOString().slice(0, 10); // "YYYY-MM-DD"
          const timeStr = time.length === 5 ? time : `${time}:00`;   // "HH:MM" or "HH:MM:SS"
          const datetimeString = `${dateStr}T${timeStr}`;

          const datetime = new Date(datetimeString);
          if (isNaN(datetime.getTime())) {
            console.warn(`Invalid datetime format: ${datetimeString}`);
            return false;
          }

          return datetime >= currentDate;
        });

        if (futureSchedules.length === 0) return null;

        futureSchedules.sort((a, b) => {
          const aDT = new Date(`${new Date(a.date).toISOString().slice(0, 10)}T${a.time}`);
          const bDT = new Date(`${new Date(b.date).toISOString().slice(0, 10)}T${b.time}`);
          return aDT - bDT;
        });

        return {
          ...event._doc,
          schedules: futureSchedules,
          nextSchedule: futureSchedules[0],
        };
      })
      .filter(Boolean); // remove nulls

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      count: upcomingEvents.length,
      events: upcomingEvents,
    });
  } catch (error) {
    console.error("Error in viewAllEvents:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        const now = new Date();
        const futureSchedules = event.schedules.filter(s => new Date(s.date) >= now);

        res.status(200).json({
        success: true,
        message: "Event fetched successfully",
        event: {
            ...event._doc,
            schedules: futureSchedules
        }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bookEvent = async (req, res) => {
    try {
        const { eventId, scheduleId, seatNumbers } = req.body;
        const userId = req.account._id;

        if (!eventId || !scheduleId || !seatNumbers || seatNumbers.length === 0)
        return res.status(400).json({ message: "Event ID, schedule ID, and seat numbers are required" });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Find the selected schedule inside the event
        const schedule = event.schedules.id(scheduleId);
        if (!schedule) return res.status(404).json({ message: "Schedule not found for this event" });

        const now = new Date();
        if (new Date(schedule.date) < now)
        return res.status(400).json({ message: "Cannot book past schedule" });

        // Validate seat availability
        const unavailableSeats = seatNumbers.filter(seatNumber => {
        const seat = schedule.seats.find(s => s.seatNumber === seatNumber);
        return !seat || seat.status === "booked";
        });

        if (unavailableSeats.length > 0)
        return res.status(400).json({ message: `Seats already booked or invalid: ${unavailableSeats.join(", ")}` });

        const totalPrice = event.price * seatNumbers.length;

        // Check user balance
        const user = await Account.findById(userId);
        if (user.balance < totalPrice)
        return res.status(400).json({ message: "Insufficient balance" });

        // Book seats in the schedule
        schedule.seats = schedule.seats.map(seat => {
        if (seatNumbers.includes(seat.seatNumber)) {
            return {
            ...seat.toObject(),
            status: "booked",
            userId
            };
        }
        return seat;
        });

        await event.save();

        // Deduct user balance
        user.balance -= totalPrice;
        await user.save();

        // Create booking record
        const newBooking = await Booking.create({
        userId,
        eventId,
        schedule: schedule._id,
        seats: seatNumbers,
        totalPrice,
        status: "confirmed",
        bookedAt: new Date()
        });

        res.status(201).json({
        success: true,
        message: "Booking successful",
        booking: newBooking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const viewBookings = async (req, res) => {
  try {
    const userId = req.account._id;

    const bookings = await Booking.find({ userId })
      .populate("eventId", "title schedules category price")
      .sort({ bookedAt: -1 }); // Newest first

    const formatted = bookings.map(booking => {
      const event = booking.eventId;
      const schedule = event.schedules.id(booking.schedule);

      return {
        _id: booking._id,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        bookedAt: booking.bookedAt,
        status: booking.status,
        event: {
          _id: event._id,
          title: event.title,
          category: event.category,
          price: event.price,
          date: schedule?.date,
          time: schedule?.time
        }
      };
    });

    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully",
      count: formatted.length,
      bookings: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.account._id;

    const booking = await Booking.findOne({ _id: bookingId, userId })
      .populate("eventId", "title schedules category location source destination price");

    if (!booking)
      return res.status(404).json({ message: "Booking not found or access denied" });

    const event = booking.eventId;
    const schedule = event.schedules.id(booking.schedule);

    if (!schedule)
      return res.status(404).json({ message: "Schedule not found in event" });

    const ticketData = {
      _id: booking._id,
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      bookedAt: booking.bookedAt,
      event: {
        _id: event._id,
        title: event.title,
        category: event.category,
        price: event.price,
        location: event.location,
        source: event.source,
        destination: event.destination,
        date: schedule.date,
        time: schedule.time
      }
    };

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      booking: ticketData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.account._id;

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking)
      return res.status(404).json({ message: "Booking not found or unauthorized" });

    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    const event = await Event.findById(booking.eventId);
    if (!event)
      return res.status(404).json({ message: "Associated event not found" });

    // Find the relevant schedule
    const schedule = event.schedules.id(booking.schedule);
    if (!schedule)
      return res.status(404).json({ message: "Associated schedule not found in event" });

    const now = new Date();
    if (schedule.date < now)
      return res.status(400).json({ message: "Cannot cancel past bookings" });

    // Mark seats as available in that schedule
    schedule.seats = schedule.seats.map(seat => {
      if (
        booking.seats.includes(seat.seatNumber) &&
        seat.status === "booked" &&
        seat.userId?.toString() === userId.toString()
      ) {
        return {
          ...seat.toObject(),
          status: "available",
          userId: null
        };
      }
      return seat;
    });

    await event.save();

    // Refund the user
    const user = await Account.findById(userId);
    user.balance += booking.totalPrice;
    await user.save();

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled and refunded successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
