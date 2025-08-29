import { useState } from "react";
import VehicleForm from "../components/VehicleForm";
import { addVehicle } from "../services/api";
import BookingConfirmation from "../components/BookingConfirmation";

export default function AddVehicle() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddVehicle = async (payload) => {
    try {
      await addVehicle(payload);
      setMessage("Vehicle added successfully!");
      setIsError(false);
      setShowSuccess(true);
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to add vehicle. Please try again."
      );
      setIsError(true);
      setShowSuccess(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add New Vehicle
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the details below to add a new vehicle to the fleet.
          </p>
        </div>

        <div className="p-6">
          {message && (
            <BookingConfirmation
              message={message}
              type={isError ? "error" : "success"}
              onClose={() => {
                setMessage("");
                setShowSuccess(false);
              }}
            />
          )}

          <div className="bg-white rounded-lg">
            <VehicleForm
              onSubmit={handleAddVehicle}
              showSuccess={showSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
