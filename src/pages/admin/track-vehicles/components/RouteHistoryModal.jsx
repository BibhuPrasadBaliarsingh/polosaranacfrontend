// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import {
  fetchRoutesByDate,
  fetchRoutesByMonth,
  fetchRoutesToday,
} from "../../../../api/admin/routeHistory.api";

/* ──────────────────────────────────────────────────────────
   Colour palette for multiple vehicles on the history map
   ────────────────────────────────────────────────────────── */
const VEHICLE_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#d97706",
  "#059669", "#dc2626", "#0891b2", "#65a30d",
];

const colorFor = (index) => VEHICLE_COLORS[index % VEHICLE_COLORS.length];

/* ──────────────────────────────────────────────────────────
   RouteHistoryModal
   ────────────────────────────────────────────────────────── */
const RouteHistoryModal = ({ onClose }) => {
  const [mode, setMode] = useState("today"); // "today" | "date" | "month"
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date().toISOString().slice(0, 7),
  );
  const [routes, setRoutes] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVehicle, setActiveVehicle] = useState("all");

  /* ── Fetch data whenever mode / date / month changes ── */
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedDate, selectedMonth]);

  const load = async () => {
    setLoading(true);
    setError(null);
    setRoutes([]);
    setMonthlySummary(null);

    try {
      if (mode === "today") {
        const res = await fetchRoutesToday();
        setRoutes(res.data?.routes || []);
      } else if (mode === "date") {
        const res = await fetchRoutesByDate(selectedDate);
        setRoutes(res.data?.routes || []);
      } else if (mode === "month") {
        const res = await fetchRoutesByMonth(selectedMonth);
        setMonthlySummary(res.data);
      }
    } catch (err) {
      setError("Failed to load route history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Filter visible routes ── */
  const visibleRoutes =
    activeVehicle === "all"
      ? routes
      : routes.filter((r) => r.vehicleId === activeVehicle);

  /* ── Map centre (first point of first route) ── */
  const mapCenter =
    visibleRoutes.length > 0 && visibleRoutes[0].points.length > 0
      ? [visibleRoutes[0].points[0].lat, visibleRoutes[0].points[0].lng]
      : [19.9017, 84.7985];

  /* ── Monthly summary helpers ── */
  const monthDays = monthlySummary
    ? Object.keys(monthlySummary.summary || {}).sort()
    : [];

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">🗂️ Route History</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Systematic 30-day GPS record of mapped routes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Mode tabs + Date / Month picker ── */}
        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center gap-3">
          {/* Tab buttons */}
          {[
            { key: "today", label: "📅 Today" },
            { key: "date", label: "🗓️ By Date" },
            { key: "month", label: "📊 Monthly Summary" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}

          {/* Date picker (only for "date" mode) */}
          {mode === "date" && (
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          {/* Month picker */}
          {mode === "month" && (
            <input
              type="month"
              value={selectedMonth}
              max={new Date().toISOString().slice(0, 7)}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          {/* Refresh button */}
          <button
            onClick={load}
            disabled={loading}
            className="ml-auto px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50 transition"
          >
            {loading ? "Loading…" : "🔄 Refresh"}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Error */}
          {error && (
            <div className="m-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ────────────────────────────────────────
              MAP VIEW (today + date modes)
              ──────────────────────────────────────── */}
          {!loading && mode !== "month" && (
            <>
              {/* Vehicle filter chips */}
              {routes.length > 0 && (
                <div className="px-4 pt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveVehicle("all")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      activeVehicle === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All Vehicles
                  </button>
                  {routes.map((r, i) => (
                    <button
                      key={r.vehicleId}
                      onClick={() => setActiveVehicle(r.vehicleId)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition`}
                      style={
                        activeVehicle === r.vehicleId
                          ? { backgroundColor: colorFor(i), color: "#fff" }
                          : { backgroundColor: "#f3f4f6", color: "#374151" }
                      }
                    >
                      {r.registrationNumber || r.vehicleId} ({r.points.length} pts)
                    </button>
                  ))}
                </div>
              )}

              {/* Map */}
              {visibleRoutes.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
                  <span className="text-4xl">🗺️</span>
                  <p>No route data for this period.</p>
                  <p className="text-xs text-gray-300">
                    Route history is recorded as vehicles move on the live tracking map.
                  </p>
                </div>
              ) : (
                <div className="px-4 pb-4 pt-2">
                  <MapContainer
                    key={`${mode}-${selectedDate}-${activeVehicle}`}
                    center={mapCenter}
                    zoom={13}
                    style={{
                      width: "100%",
                      height: "420px",
                      borderRadius: "12px",
                      zIndex: 0,
                    }}
                  >
                    <TileLayer
                      url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                      attribution="Google"
                      maxZoom={19}
                    />
                    {visibleRoutes.map((route, idx) => {
                      const positions = route.points.map((p) => [p.lat, p.lng]);
                      if (positions.length < 2) return null;
                      return (
                        <Polyline
                          key={route.vehicleId}
                          positions={positions}
                          pathOptions={{
                            color: colorFor(
                              routes.findIndex((r) => r.vehicleId === route.vehicleId),
                            ),
                            weight: 5,
                            opacity: 0.85,
                            lineCap: "round",
                            lineJoin: "round",
                          }}
                        >
                          <Tooltip sticky>
                            {route.registrationNumber || route.vehicleId}
                            <br />
                            {positions.length} GPS points
                          </Tooltip>
                        </Polyline>
                      );
                    })}
                  </MapContainer>

                  {/* Legend */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {routes.map((r, i) => (
                      <div key={r.vehicleId} className="flex items-center gap-2 text-xs text-gray-700">
                        <div
                          className="w-6 h-2 rounded-full"
                          style={{ backgroundColor: colorFor(i) }}
                        />
                        <span>{r.registrationNumber || r.vehicleId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ────────────────────────────────────────
              MONTHLY SUMMARY VIEW
              ──────────────────────────────────────── */}
          {!loading && mode === "month" && monthlySummary && (
            <div className="px-4 py-4 space-y-4">
              {/* Summary header */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-bold text-blue-800">
                  Month: {monthlySummary.month}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Total GPS points recorded: <strong>{monthlySummary.totalPoints}</strong>
                </p>
              </div>

              {monthDays.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-10">
                  No route data for this month yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left px-4 py-2 text-gray-600 font-semibold rounded-tl-lg">
                          Date
                        </th>
                        {Object.keys(
                          monthlySummary.summary[monthDays[0]] || {},
                        ).map((vid) => (
                          <th
                            key={vid}
                            className="text-center px-4 py-2 text-gray-600 font-semibold"
                          >
                            {vid.slice(-6)}
                          </th>
                        ))}
                        <th className="text-center px-4 py-2 text-gray-600 font-semibold rounded-tr-lg">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthDays.map((day, i) => {
                        const dayData = monthlySummary.summary[day] || {};
                        const total = Object.values(dayData).reduce(
                          (s, c) => s + c,
                          0,
                        );
                        return (
                          <tr
                            key={day}
                            className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-2 font-medium text-gray-800">
                              {new Date(day).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                weekday: "short",
                              })}
                            </td>
                            {Object.values(dayData).map((count, j) => (
                              <td
                                key={j}
                                className="text-center px-4 py-2 text-gray-600"
                              >
                                {count}
                              </td>
                            ))}
                            <td className="text-center px-4 py-2 font-bold text-blue-700">
                              {total}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteHistoryModal;
