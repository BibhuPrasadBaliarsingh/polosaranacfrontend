// @ts-nocheck

const getVehicleStatus = (item) => {
  const ignition = item?.is_ignition_on?.value ?? false;
  const speed = Number(item?.speed || 0);
  const last = item?.device_timestamp
    ? new Date(item.device_timestamp).getTime()
    : null;

  if (!last) return "offline";

  const now = Date.now();
  const diffMinutes = (now - last) / 60000;

  // OFFLINE (no data)
  if (diffMinutes > 10) return "offline";

  // RUNNING (moving)
  if (ignition && speed > 5) return "running";

  // IDLE (engine ON but not moving)
  if (ignition && speed <= 5) return "idle";

  // STOPPED (engine OFF)
  return "stopped";
};

export const normalizeVehicles = (list = []) => {
  return (list || []).map((item) => {
    const calculatedStatus = getVehicleStatus(item);

    return {
      id: item?.imei || item?._id || Date.now().toString(),
      registrationNumber: item?.truck_number || "-",

      // 🚀 USE CALCULATED STATUS (NOT DEVICE STATUS)
      status: calculatedStatus,

      assignedWard: item?.address || "-",
      speed: Number(item?.speed || 0),
      lat: item?.lat || null,
      lng: item?.lng || null,
      signalStrength: item?.signal_strength || "-",
      ignitionOn: item?.is_ignition_on?.value ?? false,

      lastUpdated: item?.device_timestamp
        ? new Date(item.device_timestamp)
        : null,
    };
  });
};
