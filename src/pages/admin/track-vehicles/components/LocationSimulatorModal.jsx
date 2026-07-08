// @ts-nocheck
import { useState, useEffect } from "react";

const LocationSimulatorModal = ({
  show,
  vehicle,
  onClose,
  onSubmit,
}) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    if (vehicle) {
      setLat(vehicle.location?.lat || 19.74);
      setLng(vehicle.location?.lng || 84.81);
    }
  }, [vehicle]);

  if (!show || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Simulate Vehicle Location</h2>
          <p className="text-sm text-gray-500 mb-6">
            Input a Latitude and Longitude to simulate the physical movement of vehicle <strong className="text-emerald-700">{vehicle.registrationNumber}</strong>. If this point falls inside a Ward's Geofence, it will trigger an automated push notification.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(vehicle.registrationNumber, Number(lat), Number(lng));
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold shadow-md transition-all"
              >
                Ping Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationSimulatorModal;
