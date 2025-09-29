import { useEffect, useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import ForwardButton from "../../components/ForwardButton";

const AdminEventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/events");
      setEvents(res.data.events);
    } catch (error) {
        console.log(error);
      alert("Failed to load events.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/events/delete/${id}`);
      alert("Event deleted.");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📅 All Events</h1>
        <ForwardButton label="Dashboard" page="/admin/dashboard" />
      </div>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="bg-gray-700 p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>Category: {event.category}</p>
              <p>Vendor: {event.vendor?.name || "N/A"}</p>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/events/${event._id}`)}
                  className="btn"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="btn bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventList;
