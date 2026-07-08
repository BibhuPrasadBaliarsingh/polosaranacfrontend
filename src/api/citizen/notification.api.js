import api from "../api";

export const fetchCitizenNotifications = async () => {
  const response = await api.get("/citizen/notifications");
  return response.data;
};

export const markCitizenNotificationRead = async (notificationId) => {
  const response = await api.patch(
    `/citizen/notifications/${notificationId}/read`,
  );
  return response.data;
};
