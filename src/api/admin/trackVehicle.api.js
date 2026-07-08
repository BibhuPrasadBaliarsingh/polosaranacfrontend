import api from "../api";

export const fetchTrackings = () =>
  api.get("/tracking/trackings");

export const assignVehicleWard = (payload) =>
  api.post("/tracking/assign-ward", payload);

export const simulateVehiclePing = (payload) =>
  api.post("/tracking/simulate-ping", payload);