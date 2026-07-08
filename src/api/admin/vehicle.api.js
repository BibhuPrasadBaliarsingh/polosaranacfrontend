import api from "../api";

export const fetchVehicles = () =>
  api.get("/tracking/trackings");
