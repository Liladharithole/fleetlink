import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://fleetlink-back-end.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

export const addVehicle = (data) => API.post("/vehicles", data);
export const getVehicles = () => API.get("/vehicles");
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);
export const searchVehicles = (params) =>
  API.get("/vehicles/available", { params });
export const bookVehicle = (data) => API.post("/bookings", data);
export const getBookings = (params) => API.get("/bookings", { params });
export const acceptBooking = (id) => API.patch(`/bookings/${id}/accept`);
export const completeBooking = (id) => API.patch(`/bookings/${id}/complete`);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

export default API;
