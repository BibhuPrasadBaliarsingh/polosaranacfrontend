import React from "react";
import { Cuboid, BadgeIndianRupee, TrendingUp } from "lucide-react";

export default function WealthCenterTabs({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "MCC",
      name: "MCC Records",
      icon: <Cuboid className="h-5 w-5" />,
    },
    {
      id: "MRF",
      name: "MRF Records",
      icon: <Cuboid className="h-5 w-5" />,
    },
    {
      id: "AGENCY",
      name: "Agency Sales",
      icon: <BadgeIndianRupee className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
}
