import { useEffect, useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorEvents();
  }, []);

  const fetchVendorEvents = async () => {
    try {
      const res = await axios.get("/api/vendors/events"); // assumes you're filtering by vendor on backend
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/vendors/events/delete/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/vendor/edit-event/${eventId}`);
  };

  const handleViewBookings = (eventId) => {
    navigate(`/vendor/bookings/${eventId}`);
  };

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back"></BackButton>
      </div>
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Events</h2>

      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>Category: {event.category}</p>
              <p>Price: ₹{event.price}</p>

              {/* Show multiple schedules */}
              <div className="mt-2">
                <p className="font-semibold">Schedules:</p>
                {event.schedules?.map((sch, idx) => (
                  <p key={idx} className="ml-2">
                    📅 {new Date(sch.date).toLocaleDateString()} at {sch.time} — 🎟 {sch.totalSeats} seats
                  </p>
                ))}
              </div>

              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEdit(event._id)} className="btn">Edit</button>
                <button onClick={() => handleDelete(event._id)} className="btn bg-red-600 hover:bg-red-700">Delete</button>
                <button onClick={() => handleViewBookings(event._id)} className="btn">View Bookings</button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
    </div>
  );
};

export default MyEvents;
