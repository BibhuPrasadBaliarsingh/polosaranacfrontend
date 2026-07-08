// @ts-nocheck
import { useState } from "react";
import { toast } from "react-toastify";

const AssignWardModal = ({
  show,
  vehicle,
  wards,
  onClose,
  onSubmit,
}) => {
  const [selectedWard, setSelectedWard] = useState("");

  if (!show || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWard) {
      toast.error("Please select a ward");
      return;
    }
    onSubmit(vehicle.registrationNumber, selectedWard);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Assign Ward
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle
              </label>
              <input
                type="text"
                disabled
                value={vehicle.registrationNumber}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Ward *
              </label>
              <select
                required
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a ward...</option>
                {wards.map((ward) => (
                  <option key={ward} value={ward.wardName}>
                    {ward.wardName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignWardModal;
