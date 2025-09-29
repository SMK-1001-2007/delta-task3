import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";

const EventBookings = () => {
  const { eventId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [eventTitle, setEventTitle] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/vendors/bookings/${eventId}`);
        setBookings(res.data.bookings);
        setEventTitle(res.data.eventTitle || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load bookings.");
      }
    };
    fetchBookings();
  }, [eventId]);

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back"></BackButton>
      </div>
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bookings for: {eventTitle}</h2>

      {bookings.length === 0 ? (
        <p>No bookings found for this event.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-900">
              <th className="border p-2">User</th>
              <th className="border p-2">Seats</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="border p-2">{b.userId?.name || "Unknown"}</td>
                <td className="border p-2">{b.seats.join(", ")}</td>
                <td className="border p-2">
                {b.schedule?.date && b.schedule?.time ? (
                  <>
                    📅 {new Date(`${b.schedule.date.split("T")[0]}T${b.schedule.time}`).toLocaleDateString()} <br />
                    ⏰ {b.schedule.time}
                  </>
                ) : (
                  "Schedule not available"
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default EventBookings;
