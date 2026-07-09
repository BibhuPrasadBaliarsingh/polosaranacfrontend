import { useState, useEffect } from "react";

const AssignWardModal = ({ show, vehicle, wards, onClose, onSubmit }) => {
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    if (show && vehicle) {
      setSelectedWard(vehicle.assignedWard || "");
    }
  }, [show, vehicle]);

  if (!show || !vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWard) return;
    onSubmit(vehicle.registrationNumber, selectedWard);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Assign Ward</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg mb-4">
            <div className="text-3xl">🚛</div>
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="font-bold text-gray-900">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Ward
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all bg-white"
                required
              >
                <option value="" disabled>-- Select a Ward --</option>
                {wards.map((w) => (
                  <option key={w._id || w.wardName} value={w.wardName}>
                    {w.wardName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedWard}
                className={`flex-1 px-4 py-2 font-semibold rounded-xl transition-colors shadow-md text-white ${
                  !selectedWard ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
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
