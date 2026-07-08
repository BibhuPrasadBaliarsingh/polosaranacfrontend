import React from "react";
import { Building2 } from "lucide-react";

export default function AdminWealthHeader() {
  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">Wealth Center Monitor</h1>
            <p className="text-amber-100 mt-1">Track all MCC, MRF, and Agency activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
