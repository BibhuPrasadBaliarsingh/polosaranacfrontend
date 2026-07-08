import React from "react";
import { AlertCircle, Wrench, CheckCircle, Loader } from "lucide-react";

export default function DefectStats({ stats }) {
  const cards = [
    {
      label: "Total Defects",
      value: stats.total,
      icon: <AlertCircle className="h-6 w-6" />,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Started",
      value: stats.started,
      icon: <Loader className="h-6 w-6" />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <Wrench className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Repaired",
      value: stats.repaired,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
