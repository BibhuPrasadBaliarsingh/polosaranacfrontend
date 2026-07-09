import { markCitizenNotificationRead } from "../../api/citizen/notification.api";

const CitizenNotifications = ({ notifications, setNotifications, onClose }) => {
  const handleMarkRead = async (notificationId) => {
    try {
      await markCitizenNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId)
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
            <SwipeableNotification
              key={notification._id}
              notification={notification}
              onDismiss={handleMarkRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

import { useState, useRef } from "react";

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
    
    setTranslateX(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(translateX) > 80) { // Threshold to dismiss
      setIsDismissing(true);
      setTranslateX(translateX > 0 ? 500 : -500); // Slide off screen
      setTimeout(() => {
        onDismiss(notification._id);
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
      className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-emerald-50 cursor-pointer relative ${
        notification.isRead ? "bg-white" : "bg-emerald-50/70"
      }`}
    >
      {/* Background Icon indicating slide to dismiss */}
      <div className="absolute inset-y-0 right-4 flex items-center justify-end -z-10 opacity-50">
         <span className="text-red-500 text-xs font-bold">Swipe</span>
      </div>
      
      <p className="text-sm font-semibold text-gray-900 bg-inherit">
        {notification.title}
      </p>
      <p className="mt-1 text-sm text-gray-700 bg-inherit">
        {notification.message}
      </p>
      <p className="mt-1 text-xs text-gray-500 bg-inherit">
        {new Date(notification.entryAt).toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default CitizenNotifications;
