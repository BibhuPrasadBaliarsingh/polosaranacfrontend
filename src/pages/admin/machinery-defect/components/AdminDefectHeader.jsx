import React from "react";
import { Wrench } from "lucide-react";

export default function AdminDefectHeader() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Wrench className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">Machinery Defect Monitor</h1>
            <p className="text-red-100 mt-1">Track all supervisor machinery defect reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
