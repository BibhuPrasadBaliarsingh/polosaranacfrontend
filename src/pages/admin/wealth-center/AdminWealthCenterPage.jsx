// @ts-nocheck
import React, { useState } from "react";
import { useAdminWealthCenter } from "./useAdminWealthCenter";
import AdminWealthHeader from "./components/AdminWealthHeader";
import WealthCenterTabs from "./components/WealthCenterTabs";
import RecordsTable from "./components/RecordsTable";
import LoadingSpinner from "./components/LoadingSpinner";
import StatsCards from "./components/StatsCards";

export default function AdminWealthCenterPage() {
  const [activeTab, setActiveTab] = useState("MCC");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { mccRecords, mrfRecords, agencySales, loading, stats } =
    useAdminWealthCenter();

  const records = activeTab === "MCC" ? mccRecords : activeTab === "MRF" ? mrfRecords : agencySales;

  const filteredRecords = records?.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      r.supervisorName?.toLowerCase().includes(searchLower) ||
      r.agencyName?.toLowerCase().includes(searchLower) ||
      r.cubeNumber?.toString().includes(searchLower) ||
      r.machineType?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Reset to page 1 when tab or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-full">
      <AdminWealthHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats Cards */}
        <StatsCards stats={stats} activeTab={activeTab} />

        {/* Tabs */}
        <WealthCenterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by supervisor, agency, cube, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Records Table */}
        <RecordsTable 
          records={filteredRecords} 
          activeTab={activeTab}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
