import React, { useEffect, useState } from "react";
import {
  getBookings,
  acceptBooking,
  completeBooking,
  deleteBooking,
} from "../services/api";

const PAGE_SIZE = 10;

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadBookings = async (nextPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getBookings({ page: nextPage, limit: PAGE_SIZE });
      setBookings(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    const prev = bookings;
    try {
      setActionLoadingId(id);
      // optimistic: mark as accepted locally
      setBookings((list) =>
        list.map((b) => (b._id === id ? { ...b, status: "accepted" } : b))
      );
      await acceptBooking(id);
    } catch (err) {
      setError("Failed to accept booking");
      // revert on failure
      setBookings(prev);
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (id) => {
    const prev = bookings;
    try {
      setActionLoadingId(id);
      // optimistic: remove locally
      setBookings((list) => list.filter((b) => b._id !== id));
      await deleteBooking(id);
      // If last item on last page deleted, move back a page
      const nextPage = prev.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
        await loadBookings(nextPage);
      }
    } catch (err) {
      setError("Failed to reject booking");
      // revert on failure
      setBookings(prev);
    } finally {
      setActionLoadingId("");
    }
  };

  const handleComplete = async (id) => {
    const prev = bookings;
    try {
      setActionLoadingId(id);
      // optimistic: mark as completed locally
      setBookings((list) =>
        list.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
      );
      await completeBooking(id);
    } catch (err) {
      setError("Failed to complete booking");
      setBookings(prev);
    } finally {
      setActionLoadingId("");
    }
  };

  useEffect(() => {
    loadBookings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const formatDateTime = (value) => {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-gray-500">No bookings found.</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {bookings.map((b) => (
              <li key={b._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      {b.vehicleId?.name || "Vehicle"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {b.fromPincode} → {b.toPincode}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Booker:{" "}
                      <span className="font-medium">
                        {b.customerName || "-"}
                      </span>{" "}
                      ({b.customerPhone || "-"})
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDateTime(b.startTime)} —{" "}
                      {formatDateTime(b.endTime)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="text-sm font-medium text-gray-900">
                      {b.vehicleId?.capacityKg ?? "-"} kg
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-green-600 text-white text-sm disabled:opacity-50"
                        onClick={() => handleAccept(b._id)}
                        disabled={
                          actionLoadingId === b._id || b.status !== "pending"
                        }
                      >
                        {b.status === "accepted"
                          ? "Accepted"
                          : actionLoadingId === b._id
                          ? "..."
                          : "Accept"}
                      </button>
                      {b.status === "accepted" && (
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
                          onClick={() => handleComplete(b._id)}
                          disabled={actionLoadingId === b._id}
                        >
                          {actionLoadingId === b._id ? "..." : "Complete"}
                        </button>
                      )}
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded text-white text-sm disabled:opacity-50 ${
                          b.status === "accepted" ? "bg-red-400" : "bg-red-600"
                        }`}
                        onClick={() => {
                          if (b.status === "accepted") {
                            const ok = window.confirm(
                              "This booking is accepted. Are you sure you want to reject and delete it?"
                            );
                            if (!ok) return;
                          }
                          handleReject(b._id);
                        }}
                        disabled={
                          actionLoadingId === b._id || b.status === "completed"
                        }
                      >
                        {actionLoadingId === b._id
                          ? "..."
                          : b.status === "completed"
                          ? "Rejected"
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingList;
