// @ts-nocheck
import { useEffect, useRef } from "react";

const NotificationsDropdown = ({
  showNotifications,
  setShowNotifications,
  unreadCount,
  notifications,
  allComplaints,
  markAsRead,
  clearAllNotifications,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-800">
                New Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-200 transition-all"
                aria-label="Close notifications"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              {unreadCount > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1 rounded-lg hover:bg-emerald-50 transition-all"
                >
                  Mark all read
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {unreadCount} unread • Citizen & Machinery • Updates every 10s •
              Total: {allComplaints.length}
            </p>
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-sm font-medium text-gray-600">
                No new notifications
              </p>
              <p className="text-xs">All complaints are up to date</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <SwipeableNotification
                key={`${notification.type}-${notification.id}`}
                notification={notification}
                onDismiss={markAsRead}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SwipeableNotification = ({ notification, onDismiss }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const startXRef = useRef(0);

  const handlePointerDown = (e) => {
    if (isDismissing) return;
    setIsDragging(true);
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - startXRef.current;
    
    // Allow dragging left or right
    setTranslateX(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(translateX) > 80) { // Threshold to dismiss
      setIsDismissing(true);
      setTranslateX(translateX > 0 ? 500 : -500); // Slide off screen
      setTimeout(() => {
        onDismiss(notification.id);
      }, 300); // wait for animation
    } else {
      setTranslateX(0); // Snap back
    }
  };

  if (isDismissing && translateX === 0) return null; // already dismissed

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s',
        opacity: 1 - Math.abs(translateX) / 200,
        touchAction: 'pan-y'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      // Mobile Touch Support Fallback
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className="p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors group border-l-4 border-l-emerald-400 bg-emerald-50/50 cursor-pointer relative"
    >
      {/* Background Icon indicating slide to dismiss */}
      <div className="absolute inset-y-0 right-4 flex items-center justify-end -z-10 opacity-50">
         <span className="text-red-500 text-xs font-bold">Swipe to dismiss</span>
      </div>

      <div className="flex items-start space-x-3 bg-emerald-50/50">
        <div
          className={`w-3 h-3 rounded-full mt-2 shrink-0 shadow-sm ${
            notification.priority === "high"
              ? "bg-red-500"
              : notification.priority === "medium"
              ? "bg-yellow-500"
              : "bg-emerald-500"
          }`}
        ></div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700">
              {notification.subject}
            </p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                notification.type === "machinery"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              {notification.type === "machinery"
                ? "MACHINERY"
                : "CITIZEN"}
            </span>
          </div>

          <p className="text-xs text-gray-600 truncate">
            {notification.name} •{" "}
            {notification.cityULB ||
              notification.district ||
              "N/A"}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
