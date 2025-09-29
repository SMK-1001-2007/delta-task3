import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";

const EventDetail = () => {
  const { eventId, scheduleId } = useParams();
  const [event, setEvent] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventAndSchedule = async () => {
      try {
        const res = await axios.get(`/api/users/events/${eventId}`);
        const fetchedEvent = res.data.event;
        setEvent(fetchedEvent);

        const selected = fetchedEvent.schedules.find(sch => sch._id === scheduleId);
        if (!selected) {
          alert("Schedule not found for this event.");
          navigate("/user/events");
          return;
        }

        setSchedule(selected);
      } catch (err) {
        console.error(err);
        alert("Could not fetch event.");
        navigate("/user/events");
      }
    };

    fetchEventAndSchedule();
  }, [eventId, scheduleId, navigate]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      return alert("Please select at least one seat.");
    }
    navigate("/user/ticket-summary", {
      state: {
        event,
        schedule,
        selectedSeats
      }
    });
  };

  if (!event || !schedule) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-10 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-start">
        <BackButton label="Go Back" />
      </div>

      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-1">Category: {event.category}</p>
      <p className="mb-1">
        Date: {new Date(schedule.date).toLocaleDateString()} @ {schedule.time}
      </p>
      <p className="mb-4">Price per seat: ₹{event.price}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Select Seats</h2>
      <div className="grid grid-cols-6 gap-2 mb-4 text-gray-950">
        {schedule.seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seatNumber);
          const isBooked = seat.status === "booked";

          return (
            <button
              key={seat.seatNumber}
              disabled={isBooked}
              onClick={() => handleSeatClick(seat.seatNumber)}
              className={`w-12 h-12 rounded text-sm font-semibold border
                ${isBooked ? "bg-gray-400 cursor-not-allowed" :
                  isSelected ? "bg-yellow-500 text-white" :
                  "bg-white hover:bg-blue-100"}
              `}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <span className="inline-block w-4 h-4 bg-white border mr-2" /> Available
        <span className="inline-block w-4 h-4 bg-yellow-500 border ml-4 mr-2" /> Selected
        <span className="inline-block w-4 h-4 bg-gray-400 border ml-4 mr-2" /> Booked
      </div>

      <button
        className="btn"
        onClick={handleProceed}
        disabled={selectedSeats.length === 0}
      >
        Proceed to Summary ({selectedSeats.length} seats)
      </button>
    </div>
  );
};

export default EventDetail;
