import TrackVehicleHeader from "../../admin/track-vehicles/components/TrackVehicleHeader";
import TrackVehicleMap from "../../admin/track-vehicles/components/TrackVehicleMap";
import VehicleList from "../../admin/track-vehicles/components/VehicleList";
import { useTrackVehicle } from "../../admin/track-vehicles/useTrackVehicle";
import CitizenNotifications from "../../../components/citizen/CitizenNotifications";

const TrackVehiclePage = () => {
  const {
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
    loading,
  } = useTrackVehicle();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TrackVehicleHeader />
        <div className="mb-6">
          {/* <CitizenNotifications /> */}
        </div>

        <TrackVehicleMap
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
        />
        <VehicleList
          filteredVehicles={filteredVehicles}
          loading={loading}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
    </div>
  );
};

export default TrackVehiclePage;
