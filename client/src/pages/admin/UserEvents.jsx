import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";
import EventCard from "../../components/EventCard";

const AdminUserEvents = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchBookings = async () => {
    try {
      const res = await axios.get(`/api/admin/events/${userId}`);
      const { name, bookings } = res.data;
      setBookings(bookings);
      setUserName(name);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch user's bookings.");
    } finally {
      setLoading(false);
    }
  };
    fetchBookings();
  }, [userId]);


  if (loading) return <p className="text-white p-10">Loading user bookings...</p>;

  return (
    <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <div className="flex justify-between mb-4">
        <BackButton label="Go Back" />
        <h1 className="text-2xl font-bold">🎟 Bookings by {userName}</h1>
      </div>

      {bookings.length === 0 ? (
        <p>This user has not booked any events.</p>
      ) : (
        bookings.map((booking) => {
          const event = booking.eventId;
          const schedule = booking.schedule;

          return (
            <EventCard
              key={booking._id}
              _id={event._id}
              title={event.title}
              category={event.category}
              date={schedule.date}
              time={schedule.time}
              buttonLabel="View Event"
              onButtonClick={() => navigate(`/admin/events/${event._id}`)}
            >
              <p><strong>Seats:</strong> {booking.seats.join(", ")}</p>
              <p><strong>Booked On:</strong> {new Date(booking.bookedAt).toLocaleString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={booking.status === "cancelled" ? "text-red-400" : "text-green-400"}>
                  {booking.status}
                </span>
              </p>
            </EventCard>
          );
        })
      )}
    </div>
  );
};

export default AdminUserEvents;
