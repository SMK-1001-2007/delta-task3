import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput.jsx";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user"});

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", formData);
            alert("Registration successful. Please login.");
            navigate("/auth/login");
        } catch (err) {
            console.log(err);
            alert("Error during registration");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="bg-gray-950 p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                required
            />
            <input
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                type="email"
                name="email"
                value={formData.email}
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
            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
            >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
            </select>
            <button
                className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors py-2 rounded-lg text-white font-semibold"
                type="submit"
            >
                Register
            </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
                onClick={() => navigate("/auth/login")}
                className="text-yellow-400 hover:underline cursor-pointer"
            >
                Login
            </span>
            </p>
        </div>
        </div>
    );
};

export default Register;
