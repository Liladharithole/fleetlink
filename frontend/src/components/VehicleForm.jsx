import { useState } from "react";

export default function VehicleForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", capacityKg: "", tyres: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      capacityKg: Number(form.capacityKg),
      tyres: Number(form.tyres),
    });
    setForm({ name: "", capacityKg: "", tyres: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Vehicle Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="e.g., Tata Ace"
          required
        />
      </div>

      <div>
        <label
          htmlFor="capacityKg"
          className="block text-sm font-medium text-gray-700"
        >
          Capacity (Kg)
        </label>
        <input
          id="capacityKg"
          name="capacityKg"
          type="number"
          min="0"
          step="0.01"
          value={form.capacityKg}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="e.g., 1000"
          required
        />
      </div>

      <div>
        <label
          htmlFor="tyres"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Tyres
        </label>
        <input
          id="tyres"
          name="tyres"
          type="number"
          min="0"
          value={form.tyres}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="e.g., 6"
          required
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Add Vehicle
        </button>
      </div>
    </form>
  );
}
