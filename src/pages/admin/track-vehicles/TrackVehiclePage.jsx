// @ts-nocheck
import { useState } from "react";
import TrackVehicleFilters from "./components/TrackVehicleFilters";
import TrackVehicleHeader from "./components/TrackVehicleHeader";
import TrackVehicleMap from "./components/TrackVehicleMap";
import TrackVehicleStats from "./components/TrackVehicleStats";
import VehicleList from "./components/VehicleList";
import RouteHistoryModal from "./components/RouteHistoryModal";
import LocationSimulatorModal from "./components/LocationSimulatorModal";
import { useTrackVehicle } from "./useTrackVehicle";
import { fetchAllWards } from "../../../api/admin/ward.api";
import { useEffect } from "react";

const TrackVehiclePage = () => {
  const {
    vehicles,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
    loading,
    filters,
    setFilters,
    uniqueWards,
    handleSimulateLocation,
  } = useTrackVehicle();

  const [showHistory, setShowHistory] = useState(false);
  const [simulateModalVehicle, setSimulateModalVehicle] = useState(null);
  const [allWards, setAllWards] = useState([]);

  useEffect(() => {
    fetchAllWards().then(res => setAllWards(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TrackVehicleHeader onHistoryClick={() => setShowHistory(true)} />
        <TrackVehicleStats vehicles={vehicles} />
        <TrackVehicleFilters
          filters={filters}
          setFilters={setFilters}
          wards={uniqueWards}
        />
        <TrackVehicleMap
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
        />
        <VehicleList
          filteredVehicles={filteredVehicles}
          loading={loading}
          setSelectedVehicle={setSelectedVehicle}
          onSimulateClick={(v) => setSimulateModalVehicle(v)}
        />
      </div>

      {/* Route History Modal */}
      {showHistory && (
        <RouteHistoryModal onClose={() => setShowHistory(false)} />
      )}

      {/* Simulate Location Modal */}
      <LocationSimulatorModal
        show={!!simulateModalVehicle}
        vehicle={simulateModalVehicle}
        onClose={() => setSimulateModalVehicle(null)}
        onSubmit={(vehicleNumber, lat, lng) => {
          handleSimulateLocation(vehicleNumber, lat, lng);
          setSimulateModalVehicle(null);
        }}
      />
    </div>
  );
};

export default TrackVehiclePage;
