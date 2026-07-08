import React from "react";
import { Cuboid, Leaf, TrendingUp, Package } from "lucide-react";

export default function StatsCards({ stats, activeTab }) {
  const cards =
    activeTab === "MCC"
      ? [
          {
            label: "Total MCC Records",
            value: stats.totalMcc,
            icon: <Cuboid className="h-6 w-6" />,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Total Wet Waste",
            value: `${stats.totalWetWaste.toFixed(1)} KG`,
            icon: <Leaf className="h-6 w-6" />,
            color: "from-green-500 to-green-600",
          },
          {
            label: "Total Dry Waste",
            value: `${stats.totalDryWaste.toFixed(1)} KG`,
            icon: <Package className="h-6 w-6" />,
            color: "from-yellow-500 to-yellow-600",
          },
        ]
      : activeTab === "MRF"
      ? [
          {
            label: "Total MRF Records",
            value: stats.totalMrf,
            icon: <Cuboid className="h-6 w-6" />,
            color: "from-purple-500 to-purple-600",
          },
        ]
      : [
          {
            label: "Total Agency Sales",
            value: stats.totalAgencySales,
            icon: <TrendingUp className="h-6 w-6" />,
            color: "from-pink-500 to-pink-600",
          },
          {
            label: "Total Value",
            value: `₹ ${stats.totalAgencyValue.toFixed(0)}`,
            icon: <Package className="h-6 w-6" />,
            color: "from-orange-500 to-orange-600",
          },
        ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${card.color} text-white rounded-xl p-6 shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold opacity-90">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
