import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X, Send, Phone, Mail } from "lucide-react";
import Footer from "../components/Footer";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/navbar/AdminNavbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const contactOptions = [
    {
      icon: <Send className="h-6 w-6" />,
      label: "Chat with us (WhatsApp)",
      color: "from-green-500 to-green-600",
      action: () => {
        // Prefilled message (URL-encoded):
        // Hello There, I need support regarding this issue.
        // Kindly assist me as soon as possible.
        const msg = encodeURIComponent(
          "Hello There, I need support regarding this issue.Kindly assist me as soon as possible."
        );
        window.open(`https://wa.me/8117856483?text=${msg}`, "_blank");
      },
    },
    {
      icon: <Phone className="h-6 w-6" />,
      label: "Call",
      color: "from-blue-500 to-blue-600",
      action: () => {
        window.location.href = "tel:8117856483";
      },
    },
    {
      icon: <Mail className="h-6 w-6" />,
      label: "Mail",
      color: "from-orange-500 to-orange-600",
      action: () => {
        window.location.href = "mailto:briskodetechnology@gmail.com";
      },
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col w-full lg:ml-64 transition-all duration-300">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 mt-16 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Contact Us Floating Button */}
      <button
        onClick={() => setShowContactModal(true)}
        className="fixed bottom-6 right-6 rounded-full bg-green-500 hover:bg-green-600 text-white p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Contact us"
      >
        <Send className="h-6 w-6" />
      </button>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
              aria-label="Close contact modal"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Choose your preferred way to get in touch with us. We're here to help!
            </p>

            <div className="space-y-3">
              {contactOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    setShowContactModal(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${option.color} text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex-shrink-0">{option.icon}</div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-gray-500 mt-6">
              Available 10:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
