import { useEffect, useState } from "react";
import axios from "../../services/api";
import EventCard from "../../components/EventCard";
import ForwardButton from "../../components/ForwardButton";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/users/events");
      setEvents(res.data.events);
      setFiltered(res.data.events);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events.");
    }
  };

  const handleFilter = (type) => {
    setCategory(type);
    if (type === "all") {
      setFiltered(events);
    } else {
      setFiltered(events.filter((e) => e.category === type));
    }
  };

  return (
    <div className="min-h-screen p-6 mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-end">
        <ForwardButton label="Profile" page = "/profile"></ForwardButton>
        <ForwardButton label="My Bookings" page= "/user/my-bookings"></ForwardButton>
      </div>
      <h1 className="text-3xl font-bold mb-4">Available Events</h1>
      <div className="mb-4 flex gap-3">
        {["all", "movie", "concert", "train"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            className={`btn ${category === type ? "bg-blue-700" : ""}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filtered.map((event) => (
            <EventCard key={event._id} {...event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
