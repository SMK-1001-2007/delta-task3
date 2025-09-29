import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";

const ScheduleSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/users/events/${eventId}`);
        setEvent(res.data.event);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch event.");
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleScheduleClick = (scheduleId) => {
    navigate(`/user/events/${eventId}/schedule/${scheduleId}`);
  };

  if (!event) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start mb-4">
        <BackButton label="Go Back" />
      </div>

      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-300 mb-6">Choose a schedule to continue booking:</p>

      {event.schedules.length === 0 ? (
        <p>No upcoming schedules for this event.</p>
      ) : (
        <div className="grid gap-3">
          {event.schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-700"
              onClick={() => handleScheduleClick(schedule._id)}
            >
            <p className="font-semibold text-lg">
              {new Date(`${new Date(schedule.date).toISOString().slice(0, 10)}T${schedule.time}`).toLocaleString()}
            </p>
              <p className="text-sm text-gray-300 mt-1">
                {event.category === "train"
                  ? `${event.source} → ${event.destination}`
                  : `Location: ${event.location}`}
              </p>
              <p className="text-sm text-gray-400">₹{event.price} per seat</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleSelection;
