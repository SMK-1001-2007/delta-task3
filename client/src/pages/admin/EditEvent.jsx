import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import BackButton from "../../components/BackButton";

const EditAdminEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    source: "",
    destination: "",
    price: "",
    schedules: [],
  });
  const [hasBookings, setHasBookings] = useState(false);
  const [newSchedules, setNewSchedules] = useState([]);

useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/admin/events/${eventId}`);
      const event = res.data.event;
      setEventData(event);

      const bookingsExist = event.schedules.some(schedule =>
        schedule.seats.some(seat => seat.status === "booked")
      );
      setHasBookings(bookingsExist);

      setForm({
        title: event.title,
        description: event.description || "",
        location: event.location || "",
        source: event.source || "",
        destination: event.destination || "",
        price: event.price,
        schedules: [],
      });
    } catch (error) {
      console.log(error);
      alert("Error fetching event");
    }
  };

  fetchEvent();
}, [eventId]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = () => {
    setNewSchedules([...newSchedules, { date: "", time: "", totalSeats: "" }]);
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...newSchedules];
    updated[index][field] = value;
    setNewSchedules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (newSchedules.length > 0) {
      payload.schedules = newSchedules;
    }

    try {
      await axios.put(`/api/admin/events/update/${eventId}`, payload);
      alert("Event updated successfully");
      navigate(`/admin/events/${eventId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  if (!eventData) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <BackButton label="Back" />
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={hasBookings}
            className="input"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input"
            rows={3}
          />
        </div>

        {eventData.category === "train" ? (
          <>
            <div>
              <label>Source</label>
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                disabled={hasBookings}
                className="input"
              />
            </div>
            <div>
              <label>Destination</label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                disabled={hasBookings}
                className="input"
              />
            </div>
          </>
        ) : (
          <div>
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={hasBookings}
              className="input"
            />
          </div>
        )}

        <div>
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            disabled={hasBookings}
            className="input"
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Add New Schedules</h2>
          {newSchedules.map((sch, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-3">
              <input
                type="date"
                value={sch.date}
                onChange={(e) => handleScheduleChange(idx, "date", e.target.value)}
                className="input"
                required
              />
              <input
                type="time"
                value={sch.time}
                onChange={(e) => handleScheduleChange(idx, "time", e.target.value)}
                className="input"
                required
              />
              <input
                type="number"
                placeholder="Total Seats"
                value={sch.totalSeats}
                onChange={(e) => handleScheduleChange(idx, "totalSeats", e.target.value)}
                className="input"
                required
              />
            </div>
          ))}

          <button
            type="button"
            className="btn bg-green-600 hover:bg-green-700"
            onClick={handleAddSchedule}
          >
            + Add Schedule
          </button>
        </div>

        <button type="submit" className="btn mt-6">
          {hasBookings ? "Add Schedule(s)" : "Update Event"}
        </button>

        {hasBookings && (
          <p className="text-yellow-400 mt-2">
            ⚠️ This event has active bookings. Only new schedules can be added.
          </p>
        )}
      </form>
    </div>
  );
};

export default EditAdminEvent;
