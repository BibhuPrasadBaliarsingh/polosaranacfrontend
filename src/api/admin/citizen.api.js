import api from "../api";

/**
 * Get all registered citizens with details
 */
export const getAllCitizenPhones = async () => {
  try {
    const response = await api.get("/admin/citizens");
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to fetch citizens",
      };
    }
    return {
      success: false,
      message: "Server error",
    };
  }
};

export const updateCitizenWard = async (citizenId, wardName) => {
  try {
    const response = await api.put(`/admin/citizens/${citizenId}/ward`, {
      wardName,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to update citizen ward",
      };
    }
    return {
      success: false,
      message: "Server error",
    };
  }
};
