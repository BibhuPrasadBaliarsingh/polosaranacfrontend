import api from "../api";

/** Fetch today's route history grouped by vehicle */
export const fetchRoutesToday = () => api.get("/tracking/routes/today");

/** Fetch route history for a specific date (YYYY-MM-DD) */
export const fetchRoutesByDate = (date) =>
  api.get(`/tracking/routes/date/${date}`);

/** Fetch monthly summary (optional ?month=YYYY-MM) */
export const fetchRoutesByMonth = (month) =>
  api.get("/tracking/routes/month", { params: month ? { month } : {} });
