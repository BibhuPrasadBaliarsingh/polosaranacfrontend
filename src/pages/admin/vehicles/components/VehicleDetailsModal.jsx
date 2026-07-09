// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getStatusBadge } from "../utils/vehicle.utils";
import { fetchAllWards } from "../../../../api/admin/ward.api";
import { assignVehicleWard } from "../../../../api/admin/trackVehicle.api";

const VehicleDetailsModal = ({ vehicle, onClose, onTrack }) => {
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (vehicle) {
      loadWards();
      // Set the initial dropdown value if it matches an assigned ward
      setSelectedWard(vehicle.assignedWard || "");
    }
  }, [vehicle]);

  const loadWards = async () => {
    try {
      const res = await fetchAllWards();
      if (res.data?.success) {
        setWards(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch wards", error);
    }
  };

  const handleAssignWard = async () => {
    if (!selectedWard) {
      toast.error("Please select a ward first.");
      return;
    }
    
    setIsAssigning(true);
    try {
      const payload = {
        vehicleNumber: vehicle.registrationNumber,
        wardName: selectedWard
      };
      const res = await assignVehicleWard(payload);
      if (res.data?.success) {
        toast.success(`Vehicle successfully assigned to ${selectedWard}`);
        // Optionally, we could call a callback to refresh the parent list here
      } else {
        toast.error("Failed to assign ward");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during assignment.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Vehicle Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>

        <div className="space-y-3 mb-6">
          <p><b>Registration:</b> {vehicle.registrationNumber}</p>
          <p><b>Current Assigned Ward (GPS):</b> {vehicle.assignedWard || "Unassigned"}</p>
          <p><b>Speed:</b> {vehicle.speed ?? "N/A"}</p>
          <div>
            <b>Status: </b> 
            <span className={`${getStatusBadge(vehicle.status)} text-white px-3 py-1 rounded-full text-xs font-semibold ml-2`}>
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* Manual Ward Assignment Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">🛠️ Manual Ward Assignment Override</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="flex-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Select Ward to Assign --</option>
              {wards.map((ward) => (
                <option key={ward._id} value={ward.wardName}>
                  {ward.wardName}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignWard}
              disabled={isAssigning || !selectedWard}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
                isAssigning || !selectedWard ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
              }`}
            >
              {isAssigning ? "Assigning..." : "Assign Ward"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Manually assigning a ward will override the automatic GPS routing and instantly notify citizens in that ward.
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl py-2 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onTrack(vehicle)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl py-2 transition-colors shadow-md"
          >
            Track Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
