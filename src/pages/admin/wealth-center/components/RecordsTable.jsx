import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function RecordsTable({ records, activeTab, currentPage, setCurrentPage }) {
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

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No records found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const paginatedRecords = records.slice(startIndex, endIndex);

  const columns =
    activeTab === "MCC"
      ? ["#", "Supervisor", "Contact", "Cube", "Wet (KG)", "Dry (KG)", "Status", "Image", "Date"]
      : activeTab === "MRF"
      ? ["#", "Supervisor", "Contact", "Cube", "Status", "Image", "Date"]
      : ["#", "Agency", "Material", "Weight (KG)", "Rate (₹)", "Total (₹)", "Date"];

  const getImageCell = (record) => {
    const imageUrl = getImageUrl(record.image);
    return imageUrl ? (
      <button
        type="button"
        onClick={() => {
          setSelectedImage(imageUrl);
          setSelectedImageAlt(record.supervisorName || record.agencyName || "Image");
        }}
        className="inline-flex items-center justify-center rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
      >
        <img src={imageUrl} alt="Record" className="h-12 w-12 object-cover" />
      </button>
    ) : (
      <span className="text-gray-400">No image</span>
    );
  };

  const getRowData = (record, index) => {
    const pageNumber = startIndex + index + 1;
    if (activeTab === "MCC") {
      return [
        pageNumber,
        record.supervisorName || "N/A",
        record.contactNumber || "N/A",
        record.cubeNumber || "N/A",
        record.wetWasteKg ?? 0,
        record.dryWasteKg ?? 0,
        record.status || "Stored",
        getImageCell(record),
        record.dateSubmitted || record.createdAt
          ? new Date(record.dateSubmitted || record.createdAt).toLocaleDateString()
          : "N/A",
      ];
    } else if (activeTab === "MRF") {
      return [
        pageNumber,
        record.supervisorName || "N/A",
        record.contactNumber || "N/A",
        record.cubeNumber || "N/A",
        record.status || "Stored",
        getImageCell(record),
        record.dateSubmitted || record.createdAt
          ? new Date(record.dateSubmitted || record.createdAt).toLocaleDateString()
          : "N/A",
      ];
    } else {
      return [
        pageNumber,
        record.agencyName || "N/A",
        record.material || "N/A",
        record.weightKg || 0,
        record.ratePerKg || 0,
        record.totalAmount || 0,
        record.dateSubmitted || record.createdAt
          ? new Date(record.dateSubmitted || record.createdAt).toLocaleDateString()
          : "N/A",
      ];
    }
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
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record, idx) => {
              const rowData = getRowData(record, idx);
              return (
                <tr
                  key={record._id || idx}
                  className="border-b border-gray-100 hover:bg-amber-50 transition-colors"
                >
                  {rowData.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-6 py-4 text-sm text-gray-700">
                      {typeof cell === "number" && cellIdx > 0 ? cell.toFixed(2) : cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, records.length)} of {records.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-amber-600 text-white hover:bg-amber-700"
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
                        ? "bg-amber-600 text-white"
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
                  : "bg-amber-600 text-white hover:bg-amber-700"
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
