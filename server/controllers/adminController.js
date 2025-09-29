import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";
import Account from "../models/accountModel.js"

export const createEvent = async (req, res) => {
  try {
    const { title, category, price, schedules, vendorId } = req.body;

    const event = new Event({
      title,
      category,
      price,
      schedules,
      vendorId
    });

    await event.save();
    res.status(201).json({ success: true, message: "Event created", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("vendorId", "name email");
        res.status(200).json({ success: true, count: events.length, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const viewEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId).populate("vendorId", "name email");
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

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
      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        return res.status(400).json({
          message: "Bookings exist. Only new schedules can be added.",
        });
      }

      const newSchedules = schedules.map(({ date, time, totalSeats }) => {
        const seats = Array.from({ length: totalSeats }, (_, i) => ({
          seatNumber: `S${i + 1}`,
          status: "available",
          userId: null,
        }));
        return { date, time, totalSeats, seats };
      });

      event.schedules.push(...newSchedules);
    } else {
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
            userId: null,
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
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const hasBookings = event.schedules.some(schedule =>
      schedule.seats.some(seat => seat.status === "booked")
    );

    if (hasBookings) {
      return res.status(400).json({
        message: "Cannot delete event with active bookings",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewEventsByVendor = async (req, res) => {
  try {
    const events = await Event.find({ vendorId: req.params.vendorId });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ userId })
      .populate("eventId", "title category price")
      .sort({ bookedAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get all vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Account.find({ role: "vendor" }).select("-password");
    res.status(200).json({ success: true, count: vendors.length, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specific vendor details
export const getVendorDetails = async (req, res) => {
  try {
    const vendor = await Account.findOne({ _id: req.params.vendorId, role: "vendor" }).select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend vendor account
export const suspendVendor = async (req, res) => {
  try {
    const vendor = await Account.findOne({ _id: req.params.vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isSuspended = true;
    await vendor.save();

    res.status(200).json({ success: true, message: "Vendor suspended successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsuspendVendor = async (req, res) => {
  try {
    const vendor = await Account.findOne({ _id: req.params.vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isSuspended = false;
    await vendor.save();

    res.status(200).json({ success: true, message: "Vendor unsuspended successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete vendor account
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Account.findOne({ _id: req.params.vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await Account.deleteOne({ _id: vendor._id });
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await Account.find({ role: "user" }).select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specific user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.params.userId, role: "user" }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend user account
export const suspendUser = async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.params.userId, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = true;
    await user.save();

    res.status(200).json({ success: true, message: "User suspended successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsuspendUser = async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.params.userId, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = false;
    await user.save();

    res.status(200).json({ success: true, message: "User unsuspended successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.params.userId, role: "user" });
    if (!user) return res.status(404).json({ message: "User not found" });

    await Account.deleteOne({ _id: user._id });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getAdminDashboard = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await Account.countDocuments({ role: "user" });
    const totalVendors = await Account.countDocuments({ role: "vendor" });
    const totalBookings = await Booking.countDocuments();

    const topEvents = await Booking.aggregate([
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: "$event._id",
          title: "$event.title",
          category: "$event.category",
          bookingCount: "$count"
        }
      }
    ]);

    res.status(200).json({
      stats: { totalEvents, totalBookings, totalUsers, totalVendors },
      topEvents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
