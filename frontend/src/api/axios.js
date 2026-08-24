import axios from "axios";

// in dev, Vite's proxy forwards "/api" to localhost:5000 (see vite.config.js)
// in production, VITE_API_URL points straight at the deployed backend
const apiBase = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";

const api = axios.create({
  baseURL: apiBase,
});

// attach token to every request if user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
