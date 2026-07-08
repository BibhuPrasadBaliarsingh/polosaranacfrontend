// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, CheckCircle2, XCircle, Palmtree, BarChart3 } from "lucide-react";
import AttendanceCard from "./components/AttendanceCard";
import StatsCard from "./components/StatsCard";
import { normalizeAttendance } from "./utils/normalizeAttendance";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    ward: 'all',
    search: ''
  });

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance");
      if (res.data?.length) {
        setStaff(normalizeAttendance(res.data));
      }
    } catch (err) {
      console.error("Failed to load attendance");
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const summaryValues = {
    total: staff.length,
    Present: staff.filter((s) => s.status === "Present").length,
    Absent: staff.filter((s) => s.status === "Absent").length,
    Leave: staff.filter((s) => s.status === "Leave").length,
  };

  const getUniqueWards = () => {
    return [...new Set(staff.map(s => s.assignedWard))].filter(Boolean).sort();
  };

  const filteredStaff = staff.filter(member => {
    const matchesStatus = filters.status === 'all' || member.status === filters.status;
    const matchesWard = filters.ward === 'all' || member.assignedWard === filters.ward;
    const matchesSearch = member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         (member.phone || '').includes(filters.search);
    return matchesStatus && matchesWard && matchesSearch;
  });

  const attendanceRate = staff.length > 0 
    ? ((summaryValues.Present / staff.length) * 100).toFixed(1) 
    : 0;

  const statsCards = [
    {
      title: "Total Staff",
      value: summaryValues.total,
      icon: Users,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      title: "Present",
      value: summaryValues.Present,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Absent",
      value: summaryValues.Absent,
      icon: XCircle,
      gradient: "from-red-500 to-rose-500"
    },
    {
      title: "On Leave",
      value: summaryValues.Leave,
      icon: Palmtree,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Rate",
      value: `${attendanceRate}%`,
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Attendance Management
              </h1>
              <p className="text-gray-600 mt-1">Track staff attendance records</p>
            </div>
            <div className="flex-shrink-0">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} showButton={false} />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, Phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ward</label>
              <select
                value={filters.ward}
                onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="all">All Wards</option>
                {getUniqueWards().map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Staff Attendance Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStaff.map((member) => (
              <AttendanceCard
                key={member.id}
                member={member}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredStaff.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Staff Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-8 text-center">
          Attendance is captured via GPS / Biometric systems.
          Supervisors can verify records but cannot modify entries.
        </p>
      </div>
    </div>
  );
};

export default Attendance;
