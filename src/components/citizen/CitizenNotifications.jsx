import { markCitizenNotificationRead } from "../../api/citizen/notification.api";

const CitizenNotifications = ({ notifications, setNotifications, onClose }) => {
  const handleMarkRead = async (notificationId) => {
    try {
      await markCitizenNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <div className="absolute top-14 right-0 w-80 sm:w-96 rounded-xl border border-emerald-100 bg-white shadow-2xl overflow-hidden z-50">
      <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
         <h3 className="text-sm font-bold text-gray-900">Ward Notifications</h3>
         <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg leading-none">×</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500 text-center">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              onClick={() => handleMarkRead(notification._id)}
              className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-emerald-50 ${
                notification.isRead ? "bg-white" : "bg-emerald-50/70"
              }`}
            >
              <p className="text-sm font-semibold text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(notification.entryAt).toLocaleString("en-IN")}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CitizenNotifications;
