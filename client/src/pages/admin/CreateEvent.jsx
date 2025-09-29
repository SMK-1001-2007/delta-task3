// 4. AdminCreateEvent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";

const AdminCreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "movie",
    description: "",
    location: "",
    source: "",
    destination: "",
    price: 0,
    schedules: [],
  });
  const [schedule, setSchedule] = useState({ date: "", time: "", totalSeats: 30 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScheduleAdd = () => {
    if (!schedule.date || !schedule.time) return alert("Enter date and time");
    setForm({
      ...form,
      schedules: [...form.schedules, { ...schedule }]
    });
    setSchedule({ date: "", time: "", totalSeats: 30 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/events/create", form);
      alert("Event created");
      navigate("/admin/events");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-2 rounded text-black"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded text-black"
        >
          <option value="movie">Movie</option>
          <option value="concert">Concert</option>
          <option value="train">Train</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded text-black"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (non-train)"
          className="p-2 rounded text-black"
        />
        <input
          name="source"
          value={form.source}
          onChange={handleChange}
          placeholder="Source (train only)"
          className="p-2 rounded text-black"
        />
        <input
          name="destination"
          value={form.destination}
          onChange={handleChange}
          placeholder="Destination (train only)"
          className="p-2 rounded text-black"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 rounded text-black"
        />

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Add Schedule</h3>
          <input
            type="date"
            value={schedule.date}
            onChange={e => setSchedule({ ...schedule, date: e.target.value })}
            className="p-2 rounded text-black mb-2"
          />
          <input
            type="time"
            value={schedule.time}
            onChange={e => setSchedule({ ...schedule, time: e.target.value })}
            className="p-2 rounded text-black mb-2"
          />
          <input
            type="number"
            value={schedule.totalSeats}
            onChange={e => setSchedule({ ...schedule, totalSeats: parseInt(e.target.value) })}
            className="p-2 rounded text-black mb-2"
            placeholder="Total Seats"
          />
          <button type="button" className="btn" onClick={handleScheduleAdd}>Add Schedule</button>
        </div>

        <ul className="list-disc list-inside text-sm">
          {form.schedules.map((sch, i) => (
            <li key={i}>
              📅 {sch.date} ⏰ {sch.time} 🪑 {sch.totalSeats} seats
            </li>
          ))}
        </ul>

        <button className="btn mt-4">Create Event</button>
      </form>
    </div>
  );
};

export default AdminCreateEvent;
