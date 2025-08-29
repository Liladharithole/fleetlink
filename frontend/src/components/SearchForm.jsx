import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Package, MapPin, CalendarClock, User, Phone } from "lucide-react";

export default function SearchForm({ onSearch }) {
  const [form, setForm] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
    customerName: "",
    customerPhone: "",
  });

  const formatNowLocal = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const [minStart, setMinStart] = useState(formatNowLocal());

  useEffect(() => {
    const id = setInterval(() => setMinStart(formatNowLocal()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTime") {
      if (value && value < minStart) {
        setForm({ ...form, startTime: minStart });
        return;
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (date) => {
    if (!date) return;
    const iso = new Date(date).toISOString();
    setForm((prev) => ({ ...prev, startTime: iso }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="capacityRequired"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Required Capacity (Kg)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Package className="h-5 w-5" />
            </div>
            <input
              id="capacityRequired"
              name="capacityRequired"
              type="number"
              min="0"
              value={form.capacityRequired}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              placeholder="e.g., 500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pickup Date & Time
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <CalendarClock className="h-5 w-5 mb-4 align-middle" />
            </div>
            <DatePicker
              selected={form.startTime ? new Date(form.startTime) : null}
              onChange={handleDateChange}
              showTimeSelect
              timeIntervals={15}
              minDate={new Date()}
              minTime={new Date()}
              maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select pickup date & time"
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              wrapperClassName="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Pick from now onwards (15 min steps).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fromPincode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Pincode
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              id="fromPincode"
              name="fromPincode"
              type="text"
              pattern="\d{6}"
              title="Please enter a 6-digit pincode"
              value={form.fromPincode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              placeholder="e.g., 400001"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="toPincode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To Pincode
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              id="toPincode"
              name="toPincode"
              type="text"
              pattern="\d{6}"
              title="Please enter a 6-digit pincode"
              value={form.toPincode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              placeholder="e.g., 110001"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-5 w-5" />
            </div>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={form.customerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              placeholder="e.g., John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="customerPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Phone
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone className="h-5 w-5" />
            </div>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              value={form.customerPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 pl-11 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 border"
              placeholder="e.g., +91 9876543210"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
          Search Availability
        </button>
      </div>
    </form>
  );
}
