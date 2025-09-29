import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/api";
import PasswordInput from "../../components/PasswordInput";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmNewPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await axios.put(`/api/auth/reset-password/${token}`, { newPassword, confirmNewPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/auth/login"), 2000); // redirect to login
    } catch (error) {
        console.log(error)
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-950 p-8 rounded-2xl shadow-md w-full max-w-md space-y-3"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <PasswordInput
            name="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
        /> 
        <PasswordInput
            name="confirmpassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm Password"
        /> 
        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors py-2 rounded-lg text-white font-semibold"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
