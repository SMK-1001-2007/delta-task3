import { useEffect, useState } from "react";
import axios from "../../services/api";
import { useNavigate } from "react-router-dom";
import ForwardButton from "../../components/ForwardButton";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users/");
      setUsers(res.data.users);
    } catch (err) {
        console.log(err)
      alert("Failed to fetch users");
    }
  };

  const handleSuspendToggle = async (userId, isSuspended) => {
    const action = isSuspended ? "unsuspend" : "suspend";
    const confirm = window.confirm(`Are you sure you want to ${action} this user?`);
    if (!confirm) return;

    try {
      await axios.patch(`/api/admin/users/${action}/${userId}`);
      alert(`User ${action}ed successfully`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/users/delete/${userId}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👤 All Users</h1>
        <ForwardButton label="Dashboard" page="/admin/dashboard" />
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-700 p-4 rounded bg-gray-800 shadow"
            >
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Status: {user.isSuspended ? "Suspended" : "Active"}</p>

              <div className="flex gap-3 mt-3">
                <button
                  className="btn bg-blue-600"
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                >
                  View Details
                </button>

                <button
                  className={`btn ${user.isSuspended ? "bg-green-600" : "bg-yellow-600"}`}
                  onClick={() => handleSuspendToggle(user._id, user.isSuspended)}
                >
                  {user.isSuspended ? "Unsuspend" : "Suspend"}
                </button>

                <button
                  className="btn bg-red-600"
                  onClick={() => handleDelete(user._id)}
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

export default AdminUserList;
