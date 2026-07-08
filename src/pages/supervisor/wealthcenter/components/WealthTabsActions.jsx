import { Cuboid, Plus, Download, BadgeIndianRupee } from "lucide-react";
import { getWealthCenterFullName } from "../utils/wealthCenterHelpers";

const WealthTabsActions = ({
  activeTab,
  setActiveTab,
  onMccAction,
  onMrfAction,
  onOpenRecordForm,
  onDownloadPdf,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => setActiveTab("MCC")}
        className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
          activeTab === "MCC"
            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
       <Cuboid /> {activeTab === "MCC" ? getWealthCenterFullName("MCC") : "MCC"}

      </button>

      <button
        onClick={() => setActiveTab("MRF")}
        className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
          activeTab === "MRF"
            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Cuboid /> {activeTab === "MRF" ? getWealthCenterFullName("MRF") : "MRF"}

      </button>

      <button
        onClick={() => {
          if (activeTab === "MCC") onMccAction();
          else onMrfAction();
        }}
        className={`px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-200 flex items-center gap-2 ${
          activeTab === "MCC"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600"
            : "bg-gradient-to-r from-green-600 to-emerald-600"
        }`}
      >
        {activeTab === "MCC" ? (
          <>
            <Cuboid className="h-5 w-5" /> MO Khata
          </>
        ) : (
          <>
            <BadgeIndianRupee className="h-5 w-5" /> Agency
          </>
        )}
      </button>

      <button
        onClick={onOpenRecordForm}
        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Add Record
      </button>

      <button
        onClick={onDownloadPdf}
        className="px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 sm:ml-auto"
      >
        <Download className="h-5 w-5" />
        Download PDF
      </button>
    </div>
  );
};

export default WealthTabsActions;
