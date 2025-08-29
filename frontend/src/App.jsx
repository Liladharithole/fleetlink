import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Truck, Home, PlusSquare, ClipboardList, Menu, X } from "lucide-react";
import AddVehicle from "./pages/AddVehicle";
import SearchAndBook from "./pages/SearchAndBook";
import BookingList from "./pages/BookingList";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <NavLink
                  to="/"
                  className="flex-shrink-0 flex items-center text-indigo-600"
                >
                  <Truck className="h-7 w-7" />
                  <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">
                    FleetLink
                  </span>
                </NavLink>
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
                <button
                  type="button"
                  aria-label="Toggle menu"
                  onClick={() => setMobileOpen((v) => !v)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {mobileOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu panel */}
          {mobileOpen && (
            <div className="sm:hidden border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to="/search"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  end
                >
                  <Home className="h-4 w-4 mr-2" /> Home
                </NavLink>
                <NavLink
                  to="/add-vehicle"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <PlusSquare className="h-4 w-4 mr-2" /> Add Vehicle
                </NavLink>
                <NavLink
                  to="/bookings"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <ClipboardList className="h-4 w-4 mr-2" /> Bookings
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SearchAndBook />} />
            <Route path="/search" element={<SearchAndBook />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/bookings" element={<BookingList />} />
          </Routes>
        </main>

        <footer className="border-t bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <p className="text-center sm:text-left">
              Made by{" "}
              <span className="font-medium text-gray-800">Liladhar</span>
            </p>
            <p className="text-center sm:text-right">
              Maintained by{" "}
              <span className="font-medium text-gray-800">Liladhar</span>
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
