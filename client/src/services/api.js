import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // change if needed
  withCredentials: true // if using cookies
});

// Attach JWT from localStorage if applicable
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
