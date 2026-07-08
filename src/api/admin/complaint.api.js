// @ts-nocheck
import api from "../api";

export const fetchAllComplaints = () =>
  api.get("/complaints/allcomplaints");

export const updateComplaintStatus = (id, status) =>
  api.put(`/complaints/update-complaint-status/${id}`, { status });
