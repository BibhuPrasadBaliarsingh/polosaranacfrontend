import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";

export default function DefectsTable({ defects, currentPage, setCurrentPage }) {
  const RECORDS_PER_PAGE = 10;
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    if (image.startsWith("uploads/")) return `https://amapolosara.com/images/${image}`;
    return `https://amapolosara.com/images/${image}`;
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedImageAlt("");
  };

  if (!defects || defects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No defects found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(defects.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const paginatedDefects = defects.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    const badges = {
      started: "bg-yellow-100 text-yellow-800",
      inprogress: "bg-blue-100 text-blue-800",
      repaired: "bg-green-100 text-green-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">#</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Supervisor</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Machine Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Image</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDefects.map((defect, idx) => {
              const pageNumber = startIndex + idx + 1;
              return (
                <tr
                  key={defect._id || idx}
                  className="border-b border-gray-100 hover:bg-red-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{pageNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{defect.supervisorName || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{defect.contactNumber || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{defect.machineType || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{defect.description || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(defect.status)}`}>
                      {defect.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {defect.image ? (
                      <button
                        type="button"
                        onClick={() => {
                          const imageUrl = getImageUrl(defect.image);
                          setSelectedImage(imageUrl);
                          setSelectedImageAlt(defect.supervisorName || "Machinery Image");
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ImageIcon className="h-4 w-4" />
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {defect.createdAt
                      ? new Date(defect.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 shadow hover:bg-gray-100"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <div className="max-h-[80vh] overflow-hidden">
              <img
                src={selectedImage}
                alt={selectedImageAlt}
                className="w-full h-auto max-h-[80vh] object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, defects.length)} of {defects.length} defects
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
