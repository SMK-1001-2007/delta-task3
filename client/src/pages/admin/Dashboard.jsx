import { useEffect, useState } from "react";
import axios from "../../services/api";
import ForwardButton from "../../components/ForwardButton";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topEvents, setTopEvents] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard");
      setStats(res.data.stats);
      setTopEvents(res.data.topEvents);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data");
    }
  };

  if (!stats) return <p className="text-center mt-10 text-white">Loading dashboard...</p>;

  return (
    <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>
        <div className="flex gap-3">
          <ForwardButton label="Events" page="/admin/events" />
          <ForwardButton label="Vendors" page="/admin/vendors" />
          <ForwardButton label="Users" page="/admin/users" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total Events</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalEvents}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalBookings}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total Vendors</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalVendors}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">🔥 Top Performing Events</h2>
      <div className="grid gap-3">
        {topEvents.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          topEvents.map((event) => (
            <div
              key={event._id}
              className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>Category: {event.category}</p>
              </div>
              <div>
                <span className="text-2xl font-bold">
                  {event.bookingCount} 📦
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
