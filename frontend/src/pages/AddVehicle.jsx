import { useEffect, useState } from "react";
import VehicleForm from "../components/VehicleForm";
import { addVehicle, getVehicles, deleteVehicle } from "../services/api";
import BookingConfirmation from "../components/BookingConfirmation";

export default function AddVehicle() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await getVehicles();
      setVehicles(data.data || []);
    } catch (err) {
      setMessage("Failed to load vehicles.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleAddVehicle = async (payload) => {
    try {
      await addVehicle(payload);
      setMessage("Vehicle added successfully!");
      setIsError(false);
      setShowSuccess(true);
      await loadVehicles();
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
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 12h8M12 8v8" />
              </svg>
            </span>
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

          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Current Vehicles
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {loading ? (
                <div className="p-6 text-gray-500">Loading...</div>
              ) : vehicles.length === 0 ? (
                <div className="p-6 text-gray-500">No vehicles added yet.</div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {vehicles.map((v) => (
                    <li
                      key={v._id}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {v.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {v.capacityKg} kg · {v.tyres} tyres
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-red-600 text-white text-sm disabled:opacity-50"
                          onClick={async () => {
                            const ok = window.confirm(
                              `Are you sure you want to remove "${v.name}"?`
                            );
                            if (!ok) return;
                            try {
                              setActionLoadingId(v._id);
                              await deleteVehicle(v._id);
                              await loadVehicles();
                            } catch (e) {
                              setMessage("Failed to delete vehicle");
                              setIsError(true);
                            } finally {
                              setActionLoadingId("");
                            }
                          }}
                          disabled={actionLoadingId === v._id}
                        >
                          {actionLoadingId === v._id ? "..." : "Remove"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
