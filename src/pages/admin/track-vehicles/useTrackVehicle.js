// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchTrackings, simulateVehiclePing } from "../../../api/admin/trackVehicle.api";
import { ALLOWED_VEHICLES } from "./utils/trackVehicle.utils";

export const useTrackVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    ward: "all",
    search: "",
  });
  const prevVehiclesRef = useRef([]);

  const vehiclesAreEqual = (current, next) => {
    if (current.length !== next.length) return false;
    for (let i = 0; i < current.length; i += 1) {
      const a = current[i];
      const b = next[i];
      if (
        a.id !== b.id ||
        a.status !== b.status ||
        a.speed !== b.speed ||
        a.ignitionOn !== b.ignitionOn ||
        a.assignedWard !== b.assignedWard ||
        a.location.lat !== b.location.lat ||
        a.location.lng !== b.location.lng ||
        a.lastUpdated.getTime() !== b.lastUpdated.getTime()
      ) {
        return false;
      }
    }
    return true;
  };

  const getVehicleStatus = (item) => {
    const lastUpdated = item.device_timestamp
      ? new Date(item.device_timestamp).getTime()
      : null;

    if (!lastUpdated || Number.isNaN(lastUpdated)) {
      return "dataNotRetrieving";
    }

    const now = Date.now();
    const diffMinutes = (now - lastUpdated) / 60000;

    if (diffMinutes > 10) {
      return "dataNotRetrieving";
    }

    if (item.lat == null || item.lng == null) {
      return "dataNotRetrieving";
    }

    if (item.speed > 0) {
      return "running";
    }

    return "standing";
  };

  const fetchVehicleLocations = async () => {
    try {
      setLoading(true);
      const response = await fetchTrackings();
      const list = response.data?.data?.list || [];

      const previousById = prevVehiclesRef.current.reduce((acc, vehicle) => {
        acc[vehicle.id] = vehicle;
        return acc;
      }, {});

      const normalizedVehicles = list
        .filter(item => ALLOWED_VEHICLES.includes(item.truck_number))
        .map(item => {
          const status = getVehicleStatus(item);
          const previous = previousById[item.imei];

          return {
            id: item.imei,
            registrationNumber: item.truck_number,
            status,
            assignedWard: item.currentWard || item.address || "N/A",
            speed: item.speed ?? null,
            location: {
              lat: Number(item.lat),
              lng: Number(item.lng),
            },
            signalStrength: item.signal_strength ?? null,
            ignitionOn: item.is_ignition_on?.value ?? false,
            lastUpdated: new Date(item.device_timestamp),
            type: "compactor",
            routeProgress: previous?.routeProgress ?? 0,
          };
        });

      if (!vehiclesAreEqual(prevVehiclesRef.current, normalizedVehicles)) {
        setVehicles(normalizedVehicles);
        prevVehiclesRef.current = normalizedVehicles;
      }
    } catch (error) {
      toast.error("Failed to fetch vehicle locations");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleLocations();
    const interval = setInterval(fetchVehicleLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateLocation = async (vehicleNumber, lat, lng) => {
    try {
      await simulateVehiclePing({ vehicleNumber, lat, lng });
      toast.success(`Simulated ping for ${vehicleNumber}`);
      fetchVehicleLocations();
    } catch (error) {
      toast.error("Failed to simulate ping");
    }
  };

  const filteredVehicles = useMemo(
    () => vehicles.filter(vehicle => {
      const matchesStatus = filters.status === "all" || vehicle.status === filters.status;
      const matchesWard = filters.ward === "all" || vehicle.assignedWard === filters.ward;
      const matchesSearch =
        vehicle.registrationNumber.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesWard && matchesSearch;
    }),
    [vehicles, filters],
  );

  const uniqueWards = useMemo(
    () => [...new Set(vehicles.map(v => v.assignedWard))].sort(),
    [vehicles],
  );

  return {
    vehicles,
    filteredVehicles,
    selectedVehicle,
    setSelectedVehicle,
    loading,
    filters,
    setFilters,
    uniqueWards,
    handleSimulateLocation,
  };
};
