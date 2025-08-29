import { Truck, Gauge, Timer, Plus } from "lucide-react";

export default function VehicleList({ vehicles = [], onBook, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No vehicles available at the moment.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Please try different search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Truck className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  {vehicle.name}
                </h3>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                {vehicle.tyres} Tyres
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-md bg-gray-50 p-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Capacity</span>
                  <Gauge className="h-4 w-4" />
                </div>
                <p className="mt-1 font-semibold text-gray-900">
                  {vehicle.capacityKg} Kg
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Est. Duration</span>
                  <Timer className="h-4 w-4" />
                </div>
                <p className="mt-1 font-semibold text-gray-900">
                  {vehicle.estimatedRideDurationHours} hours
                </p>
              </div>
            </div>

            <button
              onClick={() => onBook(vehicle._id)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
