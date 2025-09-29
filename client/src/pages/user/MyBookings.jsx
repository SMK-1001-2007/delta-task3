import { useEffect, useState } from "react";
import axios from "../../services/api";
import EventCard from "../../components/EventCard";
import ForwardButton from "../../components/ForwardButton";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/users/bookings/cancel-booking/${bookingId}`);
      alert("Booking cancelled.");
      fetchBookings(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/users/bookings/me");
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
      alert("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  return (
    <div className="p-10 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-end">
        <ForwardButton label="Dashboard" page="/user/events" />
      </div>
      <h1 className="text-2xl font-bold mb-4">🎟 My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You haven't booked any tickets yet.</p>
      ) : (
        bookings.map((booking) => {
          const event = booking.event;

          return (
            <EventCard
              key={booking._id}
              _id={event?._id}
              title={event?.title}
              category={event?.category}
              date={event?.date}
              time={event?.time}
            >
            <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
            <p><strong>Booked On:</strong> {new Date(booking.bookedAt).toLocaleString()}</p>
            {booking.status === "cancelled" ? (
              <span className="text-red-500 font-semibold">Cancelled</span>
            ) : (
              <button
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleCancel(booking._id)}
              >
                Cancel Booking
              </button>
            )}
          </EventCard>
          );
        })
      )}
    </div>
  );
};

export default MyBookings;
