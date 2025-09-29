import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";

const AdminEventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBookings, setHasBookings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/admin/events/${eventId}`);
        setEvent(res.data.event);

        // Check if any seat is booked in any schedule
        const bookingsExist = res.data.event.schedules?.some(schedule =>
          schedule.seats?.some(seat => seat.status === "booked")
        );
        setHasBookings(bookingsExist);
      } catch (error) {
        console.log(error);
        alert("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/events/delete/${eventId}`);
      alert("Event deleted successfully");
      navigate("/admin/events");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading event...</p>;
  if (!event) return <p className="text-center mt-10 text-white">Event not found.</p>;

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <BackButton label="Back to Events" />
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Price:</strong> ₹{event.price}</p>
      {event.category === "train" ? (
        <p><strong>Route:</strong> {event.source} → {event.destination}</p>
      ) : (
        <p><strong>Location:</strong> {event.location}</p>
      )}
      <p><strong>Total Schedules:</strong> {event.schedules.length}</p>

      <div className="mt-6 flex gap-4">
        <button
          className={`btn ${hasBookings ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={hasBookings}
          onClick={() => navigate(`/admin/events/edit/${event._id}`)}
        >
          Edit Event
        </button>

        <button
          className={`btn bg-red-600 hover:bg-red-700 ${hasBookings ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={hasBookings}
          onClick={handleDelete}
        >
          Delete Event
        </button>
      </div>

      {hasBookings && (
        <p className="text-yellow-400 mt-3">
          ⚠️ This event has bookings. Edit/Delete is disabled.
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Schedules</h2>
        {event.schedules.map((s, idx) => (
          <div key={idx} className="border border-gray-600 p-4 rounded mb-3">
            <p><strong>Date:</strong> {new Date(`${s.date}T${s.time}`).toLocaleString()}</p>
            <p><strong>Total Seats:</strong> {s.totalSeats}</p>
            <p>
              <strong>Booked Seats:</strong>{" "}
              {s.seats.filter(seat => seat.status === "booked").length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventDetail;
