import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://fleetlink-back-end.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

export const addVehicle = (data) => API.post("/vehicles", data);
export const searchVehicles = (params) =>
  API.get("/vehicles/available", { params });
export const bookVehicle = (data) => API.post("/bookings", data);

export default API;
