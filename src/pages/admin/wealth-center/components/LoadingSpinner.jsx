import React from "react";
import { Loader } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="text-center">
        <Loader className="h-12 w-12 text-amber-600 animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-700">Loading wealth center data...</p>
      </div>
    </div>
  );
}
