import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";

const AdminVendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get("/api/admin/vendors");
      setVendors(res.data.vendors);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (vendorId) => {
    try {
      await axios.patch(`/api/admin/vendors/suspend/${vendorId}`);
      fetchVendors();
    } catch (error) {
        console.log(error)
      alert("Failed to suspend vendor");
    }
  };

  const handleUnsuspend = async (vendorId) => {
    try {
      await axios.patch(`/api/admin/vendors/unsuspend/${vendorId}`);
      fetchVendors();
    } catch (err) {
        console.log(err)
      alert("Failed to unsuspend vendor");
    }
  };

  const handleDelete = async (vendorId) => {
    const confirm = window.confirm("Are you sure you want to delete this vendor?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/vendors/delete/${vendorId}`);
      fetchVendors();
    } catch (err) {
        console.log(err)
      alert("Failed to delete vendor");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading vendors...</p>;

  return (
    <div className="p-10 text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-2xl font-bold mb-4">🧑‍💼 All Vendors</h1>
      {vendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{vendor.name}</h2>
              <p>Email: {vendor.email}</p>
              <p>Status: {vendor.status}</p>

              <div className="flex gap-3 mt-3">
                <button
                  className="btn"
                  onClick={() => navigate(`/admin/vendors/${vendor._id}`)}
                >
                  View Details
                </button>
                <button
                  className="btn"
                  onClick={() => navigate(`/admin/vendors/${vendor._id}/events`)}
                >
                  View Events
                </button>
                {vendor.status === "suspended" ? (
                  <button
                    className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                    onClick={() => handleUnsuspend(vendor._id)}
                  >
                    Unsuspend
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
                    onClick={() => handleSuspend(vendor._id)}
                  >
                    Suspend
                  </button>
                )}
                <button
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleDelete(vendor._id)}
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

export default AdminVendorList;
