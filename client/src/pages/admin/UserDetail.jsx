// AdminUserDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import ForwardButton from "../../components/ForwardButton";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/admin/users/${userId}`);
      setUser(res.data.user);
    } catch (err) {
        console.log(err);
      alert("Failed to fetch user details");
    }
  };
    fetchUser();
  }, [userId]);



  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👤 User Details</h1>
        <ForwardButton label="Back to Users" page="/admin/users" />
      </div>

      <div className="bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Status: {user.isSuspended ? "Suspended" : "Active"}</p>
        <p>Balance: ₹{user.balance}</p>
      </div>

      <button
        className="btn bg-blue-600 mt-6"
        onClick={() => navigate(`/admin/events/by-user/${user._id}`)}
      >
        View Events Booked by this User
      </button>
    </div>
  );
};

export default AdminUserDetails;