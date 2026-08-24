import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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
