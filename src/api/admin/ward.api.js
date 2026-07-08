// @ts-nocheck
import api from "../api";

export const fetchAllWards = () =>
  api.get("/wards/getallwards");

export const createWard = (payload) =>
  api.post("/wards/createward", payload);

export const updateWard = (id, payload) =>
  api.put(`/wards/${id}`, payload);

export const deleteWard = (id) =>
  api.delete(`/wards/${id}`);
