import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import PasswordInput from "../components/PasswordInput";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState({ name: false, email: false });
  const [editedData, setEditedData] = useState({ name: "", email: "" });
  const [passwordFormVisible, setPasswordFormVisible] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditedData({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Unauthorized or session expired");
        localStorage.removeItem("token");
        navigate("/auth/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = passwordData;

    if (newPassword !== confirmNewPassword) {
        alert("New password and confirm password do not match");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        await axios.put(
        "http://localhost:5000/api/profile/change-password",
        { oldPassword, newPassword, confirmNewPassword },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        alert("Password changed successfully");
        setPasswordFormVisible(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
        console.error("Password change failed:", err);
        alert("Password change failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/profile/edit-profile",
        { name: editedData.name, email: editedData.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
      setEditing({ name: false, email: false });
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/profile/upload-profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile({ ...profile, profilePic: res.data.url });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    }
  };

  const handleImageRemove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/profile/remove-profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({ ...profile, profilePic: null });
    } catch (err) {
      console.error("Remove image error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-950 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        {profile ? (
          <>
            <div className="mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {profile.profilePic ? (
                <img
                    src={`${profile.profilePic}?t=${new Date().getTime()}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border-2 border-yellow-500"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full bg-yellow-700 text-white text-2xl font-bold">
                    {profile.name?.charAt(0).toUpperCase()}
                </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="upload-image"
                  onChange={handleImageUpload}
                />
              </div>
              <label htmlFor="upload-image" className="cursor-pointer text-sm text-yellow-400 hover:underline">
                Change Profile Picture
              </label>
              {profile.profilePic && (
                <div>
                  <button
                    onClick={handleImageRemove}
                    className="mt-1 text-xs text-red-700 hover:underline"
                  >
                    Remove Picture
                  </button>
                </div>
              )}
            </div>

            <div className="text-left space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-400">Name:</label>
                {editing.name ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="bg-gray-800 px-2 py-1 rounded text-white w-2/3"
                  />
                ) : (
                  <span>{profile.name}</span>
                )}
                <button onClick={() => setEditing((prev) => ({ ...prev, name: !prev.name }))}>
                  <Pencil size={16} className="text-yellow-400 ml-2" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-400">Email:</label>
                {editing.email ? (
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="bg-gray-800 px-2 py-1 rounded text-white w-2/3"
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
                <button onClick={() => setEditing((prev) => ({ ...prev, email: !prev.email }))}>
                  <Pencil size={16} className="text-yellow-400 ml-2" />
                </button>
              </div>

              <div className="flex justify-between">
                <label className="text-gray-400">Role:</label>
                <span className="capitalize">{profile.role}</span>
              </div>
            </div>

            {(editing.name || editing.email) && (
              <button
                onClick={handleUpdate}
                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold"
              >
                Save Changes
              </button>
            )}

            <button
                onClick={() => setPasswordFormVisible((prev) => !prev)}
                className="mt-4 w-full text-sm text-yellow-400 hover:underline"
            >
                {passwordFormVisible ? "Cancel Password Change" : "Change Password"}
            </button>

            {passwordFormVisible && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
                <PasswordInput
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Old Password"
                />
                <PasswordInput
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                />
                <PasswordInput
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                />
                <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors py-2 rounded-lg font-semibold"
                >
                Update Password
                </button>
            </form>
            )}


            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth/login");
              }}
              className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-lg text-gray-400">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
