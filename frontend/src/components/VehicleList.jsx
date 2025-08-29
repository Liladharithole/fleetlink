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
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">
                {vehicle.name}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {vehicle.tyres} Tyres
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{vehicle.capacityKg} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Duration:</span>
                <span className="font-medium">
                  {vehicle.estimatedRideDurationHours} hours
                </span>
              </div>
            </div>

            <button
              onClick={() => onBook(vehicle._id)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
