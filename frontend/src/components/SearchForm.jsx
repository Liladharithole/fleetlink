import { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [form, setForm] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="capacityRequired"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Required Capacity (Kg)
          </label>
          <input
            id="capacityRequired"
            name="capacityRequired"
            type="number"
            min="0"
            value={form.capacityRequired}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g., 500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pickup Date & Time
          </label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
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
          <input
            id="fromPincode"
            name="fromPincode"
            type="text"
            pattern="\d{6}"
            title="Please enter a 6-digit pincode"
            value={form.fromPincode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g., 400001"
            required
          />
        </div>

        <div>
          <label
            htmlFor="toPincode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To Pincode
          </label>
          <input
            id="toPincode"
            name="toPincode"
            type="text"
            pattern="\d{6}"
            title="Please enter a 6-digit pincode"
            value={form.toPincode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g., 110001"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full md:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Search Availability
        </button>
      </div>
    </form>
  );
}
