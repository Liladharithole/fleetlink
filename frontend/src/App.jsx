import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Truck, Home, PlusSquare, ClipboardList } from "lucide-react";
import AddVehicle from "./pages/AddVehicle";
import SearchAndBook from "./pages/SearchAndBook";
import BookingList from "./pages/BookingList";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center text-indigo-600">
                  <Truck className="h-7 w-7" />
                  <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">
                    FleetLink
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                    end
                  >
                    <Home className="h-4 w-4 mr-1.5" /> Home
                  </NavLink>
                  <NavLink
                    to="/add-vehicle"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <PlusSquare className="h-4 w-4 mr-1.5" /> Add Vehicle
                  </NavLink>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <ClipboardList className="h-4 w-4 mr-1.5" /> Bookings
                  </NavLink>
                </div>
              </div>
              <div className="sm:hidden">
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600"
                      }`
                    }
                  >
                    <Home className="h-4 w-4 mr-1" /> Home
                  </NavLink>
                  <NavLink
                    to="/add-vehicle"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600"
                      }`
                    }
                  >
                    <PlusSquare className="h-4 w-4 mr-1" /> Add
                  </NavLink>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600"
                      }`
                    }
                  >
                    <ClipboardList className="h-4 w-4 mr-1" /> Bookings
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SearchAndBook />} />
            <Route path="/search" element={<SearchAndBook />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/bookings" element={<BookingList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
