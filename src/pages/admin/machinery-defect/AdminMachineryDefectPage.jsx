// @ts-nocheck
import React, { useState } from "react";
import { useAdminMachineryDefect } from "./useAdminMachineryDefect";
import AdminDefectHeader from "./components/AdminDefectHeader";
import DefectsTable from "./components/DefectsTable";
import DefectStats from "./components/DefectStats";
import LoadingSpinner from "./components/LoadingSpinner";

export default function AdminMachineryDefectPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { defects, loading, stats } = useAdminMachineryDefect();

  const filteredDefects = defects?.filter((d) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      d.supervisorName?.toLowerCase().includes(searchLower) ||
      d.contactNumber?.toLowerCase().includes(searchLower) ||
      d.machineType?.toLowerCase().includes(searchLower) ||
      d.description?.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === "all" || d.status === filterStatus;

    return matchesSearch && matchesStatus;
  }) || [];

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-full">
      <AdminDefectHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats */}
        <DefectStats stats={stats} />

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by supervisor, contact, machine, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-red-500 transition-all"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-red-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="started">Started</option>
            <option value="inprogress">In Progress</option>
            <option value="repaired">Repaired</option>
          </select>
        </div>

        {/* Defects Table */}
        <DefectsTable
          defects={filteredDefects}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
