import { useState } from "react";
import VehicleForm from "../components/VehicleForm";
import { addVehicle } from "../services/api";

export default function AddVehicle() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleAddVehicle = async (payload) => {
    try {
      const { data } = await addVehicle(payload);
      setMessage("Vehicle added successfully!");
      setIsError(false);
    } catch (err) {
      setMessage("Failed to add vehicle. Please try again.");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Vehicle</h2>
          <p className="text-gray-600 mt-1">Enter the vehicle details below</p>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                isError
                  ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                  : "bg-green-100 border-l-4 border-green-500 text-green-700"
              }`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          <div className="bg-white rounded-lg">
            <VehicleForm onSubmit={handleAddVehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}
