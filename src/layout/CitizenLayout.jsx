// @ts-nocheck
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "/image.jpg";
import api from "../api/api";
import CitizenNotifications from "../components/citizen/CitizenNotifications";

export default function CitizenLayout() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  /* ── Poll unread notification count every 15 seconds ── */
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/citizen/notifications");
        const list = res?.data?.notifications || [];
        // Only keep unread notifications so dismissed ones stay permanently removed
        const unreadList = list.filter((n) => !n.isRead);
        setNotifications(unreadList);
        setUnreadCount(unreadList.length);
      } catch {
        // silently ignore – not critical
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  /* ================= MENU CONFIG (MAP USED) ================= */
  const menuItems = [
    { path: "/citizen", label: "Dashboard", icon: "🏠", end: true },
    { path: "/citizen/complaint", label: "Post Complaint", icon: "📝" },
    { path: "/citizen/track", label: "Track Vehicle", icon: "🚛" },
    { path: "/citizen/payments", label: "Service & Payments", icon: "💳" },
    { path: "/citizen/checkpoint", label: "Checkpoint", icon: "📍" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-white text-emerald-700 shadow-sm"
        : "text-white/90 hover:bg-white/10"
    }`;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-emerald-50">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR (FIXED) ================= */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50
        h-screen w-64 bg-gradient-to-b from-emerald-500 to-emerald-700
        text-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-xl font-extrabold">Citizen</p>
          <p className="text-xs text-white/80">Citizen Panel</p>
        </div>

        {/* NAVIGATION (MAP FUNCTION) */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT → MOBILE ONLY (BOTTOM) */}
        <div className="px-4 py-4 border-t border-white/10 lg:hidden">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-white text-emerald-700 py-2 rounded-xl
                       text-sm font-semibold hover:bg-emerald-50"
          >
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN WRAPPER ================= */}
      <div className="flex-1 flex flex-col h-screen">
        {/* ================= HEADER (FIXED) ================= */}
        <header className="fixed top-0 right-0 left-0 lg:left-64
                           h-20 bg-emerald-600 text-white shadow
                           flex items-center justify-between
                           px-4 sm:px-6 z-30">
          <div className="flex items-center gap-3">
            {/* HAMBURGER (MOBILE ONLY) */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>

            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow border-2 border-white">
              <img
                src={logo}
                alt="Logo"
                className="h-14 w-14 rounded-full bg-white"
              />
            </div>

            <div>
              <p className="text-sm sm:text-base font-semibold">
                Solid Waste Management System
              </p>
              <p className="text-xs text-emerald-100">Citizen Panel</p>
            </div>
          </div>

          {/* RIGHT SIDE – Notification bell + Logout */}
          <div className="flex items-center gap-3">
            {/* 🔔 Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/20 transition"
                title="Ward Notifications"
                aria-label="View ward notifications"
              >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <CitizenNotifications 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* LOGOUT → DESKTOP ONLY (TOP RIGHT) */}
            <button
              onClick={() => (window.location.href = "/")}
              className="hidden lg:flex items-center gap-2
                         bg-white text-emerald-700
                         text-sm font-semibold px-4 py-2
                         rounded-full shadow hover:bg-emerald-50"
            >
              ⏻ Logout
            </button>
          </div>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <main
          className="flex-1 overflow-y-auto
             pt-24 px-2 lg:px-4 pb-4 
             bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
>
  {/* remove the inner white container */}
  <Outlet />
        </main>
      </div>
    </div>
  );
}
