// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchAllWards,
  createWard,
  updateWard,
  deleteWard
} from "../../../api/admin/ward.api";
import { buildWardPayload } from "./utils/ward.utils";

export const useWards = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "" });
  const [selectedWard, setSelectedWard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editWardId, setEditWardId] = useState(null);

  const [newWard, setNewWard] = useState({
    wardName: "",
    area: "",
    population: "",
    household: "",
    wasteGenerationPerDay: "",
    collectionFrequency: "Daily",
    supervisorName: "",
    supervisorPhone: "",
    centerLat: "",
    centerLng: "",
    radius: "500",
  });

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    try {
      setLoading(true);
      const res = await fetchAllWards();
      setWards(res.data.data || []);
    } catch {
      toast.error("Failed to load wards");
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditWardId(null);
    setNewWard({
      wardName: "",
      area: "",
      population: "",
      household: "",
      wasteGenerationPerDay: "",
      collectionFrequency: "Daily",
      supervisorName: "",
      supervisorPhone: "",
      centerLat: "",
      centerLng: "",
      radius: "500",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (ward) => {
    setIsEditMode(true);
    setEditWardId(ward._id);
    setNewWard({
      wardName: ward.wardName || "",
      area: ward.area || "",
      population: ward.population || "",
      household: ward.household || "",
      wasteGenerationPerDay: ward.wasteGenerationPerDay || "",
      collectionFrequency: ward.collectionFrequency || "Daily",
      supervisorName: ward.supervisorName || "",
      supervisorPhone: ward.supervisorPhone || "",
      centerLat: ward.centerLat || "",
      centerLng: ward.centerLng || "",
      radius: ward.radius || "500",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildWardPayload(newWard);
      if (isEditMode && editWardId) {
        await updateWard(editWardId, payload);
        toast.success("Ward updated successfully");
      } else {
        await createWard(payload);
        toast.success("Ward added successfully");
      }
      setShowAddModal(false);
      loadWards();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} ward`);
    }
  };

  const handleDeleteWard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ward? This action cannot be undone.")) return;
    try {
      await deleteWard(id);
      toast.success("Ward deleted successfully");
      loadWards();
    } catch (err) {
      toast.error("Failed to delete ward");
    }
  };

  const filteredWards = wards.filter(w =>
    !filters.search ||
    w.wardName?.toLowerCase().includes(filters.search.toLowerCase()) ||
    w.supervisorName?.toLowerCase().includes(filters.search.toLowerCase())
  );

  return {
    wards,
    loading,
    filters,
    setFilters,
    filteredWards,
    selectedWard,
    setSelectedWard,
    showAddModal,
    setShowAddModal,
    newWard,
    setNewWard,
    handleSubmit,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDeleteWard,
    isEditMode,
  };
};
