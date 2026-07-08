// @ts-nocheck
import { toast } from "react-toastify";
import {
  Truck,
  CheckCircle,
  XCircle,
  Wrench,
  Download,
  Search,
  MapPin,
  Gauge,
} from "lucide-react";

import { useVehicles } from "./useVehicles";
import {
  downloadVehiclesExcel,
  downloadVehiclesPDF,
} from "./utils/exportVehicles";
import { useNavigate } from "react-router-dom";

const Vehicles = () => {
  const { loading, search, setSearch, filteredVehicles, counts } = useVehicles();
const navigate=useNavigate()
  const handlePDF = () => {
    if (!filteredVehicles.length) return toast.info("No vehicle data found!");
    downloadVehiclesPDF(filteredVehicles);
  };

  const handleExcel = () => {
    if (!filteredVehicles.length) return toast.info("No vehicle data found!");
    downloadVehiclesExcel(filteredVehicles);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6 text-white shadow-xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-black/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Vehicle Management 🚛
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              Fleet monitoring • Live tracking • Operational status
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={handlePDF}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold shadow-md transition-all hover:scale-[1.03] text-xs sm:text-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleExcel}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold shadow-md transition-all hover:scale-[1.03] text-xs sm:text-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Total Vehicles"
          value={counts.total}
          icon={Truck}
          gradient="from-blue-600 via-indigo-600 to-purple-600"
        />
        <KpiCard
          title="Active"
          value={counts.active}
          icon={CheckCircle}
          gradient="from-emerald-600 via-green-600 to-lime-500"
        />
        <KpiCard
          title="Inactive"
          value={counts.inactive}
          icon={XCircle}
          gradient="from-rose-600 via-red-600 to-orange-500"
        />
        <KpiCard
          title="Maintenance"
          value={counts.maintenance}
          icon={Wrench}
          gradient="from-yellow-500 via-amber-500 to-orange-500"
        />
      </div>

      {/* SEARCH */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500">
          <Search className="text-gray-400 flex-shrink-0" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vehicle number, ward or route..."
            className="w-full outline-none bg-transparent text-gray-700 font-medium text-sm"
          />
        </div>
      </div>

      {/* TABLE + MOBILE CARDS */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 text-gray-600 font-semibold text-center">
            Loading vehicles...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-6 sm:p-8 text-gray-500 text-center font-semibold">
            No vehicles found 🚫
          </div>
        ) : (
          <>
            {/* ✅ MOBILE VIEW */}
            <div className="md:hidden space-y-4 p-3 sm:p-4">
              {filteredVehicles.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50 p-4 sm:p-5 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 text-base sm:text-lg truncate">
                        {v.registrationNumber}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {v.assignedWard || "-"}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <StatusBadge status={v.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 text-sm">
                    <MiniInfoCard
                      label="Speed"
                      value={`${v.speed || 0} km/h`}
                      icon={Gauge}
                    />

                    <MiniInfoCard
                      label="GPS"
                      value={v.lat && v.lng ? "Online" : "Offline"}
                      pill
                      type={v.lat && v.lng ? "success" : "danger"}
                    />

                    <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-1 sm:col-span-2">
                      <p className="text-xs text-gray-500 font-semibold">
                        Last Update
                      </p>
                      <p className="font-bold text-gray-900 mt-1">
                        {v.lastUpdated ? "Today" : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/supervisor/live-tracking")}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:from-emerald-800 active:to-green-800 text-white py-3 sm:py-2.5 rounded-xl font-bold shadow-md transition-all text-sm sm:text-base"
                    >
                      View Details
                    </button>
                    {v.lat && v.lng && (
                      <button
                        type="button"
                        onClick={() => navigate("/supervisor/live-tracking")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white py-3 sm:py-2.5 rounded-xl font-bold shadow-md transition-all text-sm sm:text-base"
                      >
                        Map
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                  <tr>
                    {[
                      "Vehicle No",
                      "Ward",
                      "Speed",
                      "GPS",
                      "Status",
                      "Last Update",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-bold tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredVehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b hover:bg-emerald-50/50 transition-all"
                    >
                      <td className="px-5 py-4 font-black text-gray-900">
                        {v.registrationNumber}
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        {v.assignedWard || "-"}
                      </td>
                      <td className="px-5 py-4 text-gray-700 font-semibold">
                        {v.speed || 0} km/h
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            v.lat && v.lng
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : "bg-rose-100 text-rose-700 border-rose-300"
                          }`}
                        >
                          {v.lat && v.lng ? "Online" : "Offline"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={v.status} />
                      </td>

                      <td className="px-5 py-4 text-gray-500 font-semibold">
                        {v.lastUpdated ? "Today" : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => navigate("/supervisor/live-tracking")}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow hover:shadow-lg transition-all hover:scale-[1.03]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Vehicles;

/* ===================== Components ===================== */

const KpiCard = ({ title, value, gradient, icon: Icon }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-xl text-white p-5 sm:p-6 bg-gradient-to-r ${gradient} hover:scale-[1.02] transition-all`}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-2xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm opacity-90 font-semibold">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-black mt-2">{value}</h3>
        </div>

        <div className="bg-white/20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow flex-shrink-0">
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const st = String(status || "").toLowerCase();

  let styles = "bg-gray-100 text-gray-700 border-gray-300";
  let dot = "bg-gray-500";

  if (st === "running") {
    styles = "bg-emerald-100 text-emerald-700 border-emerald-300";
    dot = "bg-emerald-600";
  } 
  else if (st === "idle") {
    styles = "bg-yellow-100 text-yellow-800 border-yellow-300";
    dot = "bg-yellow-500";
  } 
  else if (st === "stopped") {
    styles = "bg-rose-100 text-rose-700 border-rose-300";
    dot = "bg-rose-600";
  } 
  else if (st === "offline") {
    styles = "bg-gray-200 text-gray-800 border-gray-400";
    dot = "bg-gray-700";
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-black border whitespace-nowrap flex-shrink-0 ${styles}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {st || "-"}
    </span>
  );
};


const MiniInfoCard = ({ label, value, icon: Icon, pill, type }) => {
  if (pill) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
        <p className="mt-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              type === "success"
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-rose-100 text-rose-700 border-rose-300"
            }`}
          >
            {value}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-semibold">{label}</p>
      <div className="flex items-center gap-2 mt-2">
        {Icon && <Icon size={16} className="text-gray-600" />}
        <p className="font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
};
