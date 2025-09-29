import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            localStorage.setItem("token", res.data.token);
            alert("Login successful");
            if (res.data.account.role === "vendor") navigate("/vendor/dashboard");
            else if (res.data.account.role === "user") navigate("/user/events");
            else if (res.data.account.role === "admin") navigate("/admin/dashboard"); // if you implement admin later
        } catch (err) {
            console.log(err);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="bg-gray-950 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
            />
            <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            /> 
            <button
                className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors py-2 rounded-lg text-white font-semibold"
                type="submit"
            >
                Login
            </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-400">
                <p className="text-center mb-4">
                <span 
                    onClick={() => navigate("/auth/forgot-password")}
                    className="text-yellow-400  hover:underline cursor-pointer"
                >
                    Forgot password?
                </span>
                </p>
            Don’t have an account?{" "}
            <span
                onClick={() => navigate("/auth/register")}
                className="text-yellow-400 hover:underline cursor-pointer"
            >
                Register
            </span>
            </div>
        </div>
        </div>
    );
};

export default Login;
