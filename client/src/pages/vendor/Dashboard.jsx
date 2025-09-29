import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/api";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        setVendorName(res.data?.name || "Vendor");
      } catch (err) {
        console.error(err);
        setVendorName("Vendor");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6 mx-auto min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {vendorName} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Create New Event</h2>
          <p className="mb-4 text-gray-600">Add a movie, concert, or train ticket event.</p>
          <button onClick={() => navigate("/vendor/create-event")} className="btn">
            Go to Create Event
          </button>
        </div>

        <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-2">Manage My Events</h2>
          <p className="mb-4 text-gray-600">Edit, delete, or view bookings for events you've listed.</p>
          <button onClick={() => navigate("/vendor/my-events")} className="btn">
            Go to My Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
