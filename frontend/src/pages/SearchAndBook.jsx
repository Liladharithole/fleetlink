import { useState } from "react";
import SearchForm from "../components/SearchForm";
import VehicleList from "../components/VehicleList";
import BookingConfirmation from "../components/BookingConfirmation";
import { searchVehicles, bookVehicle } from "../services/api";

export default function SearchAndBook() {
  const [results, setResults] = useState([]);
  const [lastSearch, setLastSearch] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = async (form) => {
    setLoading(true);
    setMessage("");
    try {
      const params = {
        capacityRequired: Number(form.capacityRequired),
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: new Date(form.startTime).toISOString(),
      };

      const res = await searchVehicles(params);
      setLastSearch(params);

      const vehiclesWithDuration = (res.data.vehicles || []).map((v) => ({
        ...v,
        estimatedRideDurationHours: res.data.estimatedRideDurationHours,
      }));

      setResults(vehiclesWithDuration);
      setActiveTab("results");
    } catch (err) {
      console.error("❌ Search failed:", err);
      setMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (vehicleId) => {
    if (!lastSearch) {
      setMessage("Please search for vehicles first");
      return;
    }

    const payload = {
      vehicleId,
      fromPincode: lastSearch.fromPincode,
      toPincode: lastSearch.toPincode,
      startTime: lastSearch.startTime,
      customerId: "cust123", // In a real app, get this from auth context
    };

    try {
      await bookVehicle(payload);
      setMessage("Booking confirmed! Your vehicle is reserved.");
      setResults([]); // Clear results after booking
      setActiveTab("search");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      setMessage(
        err.response?.status === 409
          ? "This vehicle is no longer available. Please try another one."
          : "Booking failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Book Your Vehicle
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Find and book the perfect vehicle for your needs
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("search")}
                className={`${
                  activeTab === "search"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Search Vehicles
              </button>
              {results.length > 0 && (
                <button
                  onClick={() => setActiveTab("results")}
                  className={`${
                    activeTab === "results"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Available Vehicles ({results.length})
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {message && (
              <div className="mb-6">
                <BookingConfirmation
                  message={message}
                  type={message.includes("failed") ? "error" : "success"}
                />
              </div>
            )}

            {activeTab === "search" ? (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Enter Your Requirements
                  </h2>
                  <SearchForm onSearch={handleSearch} loading={loading} />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Available Vehicles
                  </h2>
                  <button
                    onClick={() => setActiveTab("search")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Modify Search
                  </button>
                </div>
                <VehicleList
                  vehicles={results}
                  onBook={handleBook}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
