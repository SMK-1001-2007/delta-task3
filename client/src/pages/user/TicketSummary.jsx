import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import { useState } from "react";
import BackButton from "../../components/BackButton";

const TicketSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { event, schedule, selectedSeats } = state || {};

  if (!event || !schedule || !selectedSeats) {
    return (
      <p className="text-center text-red-800 mt-10">
        Missing event or seat data. Go back and select schedule and seats again.
      </p>
    );
  }

  const totalPrice = selectedSeats.length * event.price;

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/bookings", {
        eventId: event._id,
        scheduleId: schedule._id,
        seatNumbers: selectedSeats,
      });

      navigate("/user/my-bookings", {
        state: { success: true, message: "Booking confirmed!" },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back" />
      </div>
      <h1 className="text-2xl font-bold mb-4">🎟 Ticket Summary</h1>

      <div className="border p-4 rounded-lg mb-6">
        <p><strong>Event:</strong> {event.title}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Date & Time:</strong> {new Date(schedule.date).toLocaleDateString()} at {schedule.time}</p>
        <p><strong>Price per Seat:</strong> ₹{event.price}</p>
      </div>

      <div className="mb-4">
        <p><strong>Selected Seats:</strong> {selectedSeats.join(", ")}</p>
        <p><strong>Total:</strong> ₹{totalPrice}</p>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={loading}
        className="btn"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default TicketSummary;
