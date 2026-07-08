// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";

import WealthHeader from "./components/WealthHeader";
import SearchFilterBar from "./components/SearchFilterBar";
import RecordsList from "./components/RecordsList";
import FormModal from "./components/FormModal";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import CameraField from "./components/CameraField";
import WealthTabsActions from "./components/WealthTabsActions";
import AgencyFormFields from "./components/AgencyFormFields";

import { AGENCY_MATERIALS } from "./config/wealthCenterConfig";
import { validatePhone, canSubmitRecord } from "./utils/wealthCenterHelpers";
import { getWealthCenterFullName } from "./utils/wealthCenterHelpers";

import { useWealthCenter } from "./hooks/useWealthCenter";

function WealthCenter() {
  const navigate = useNavigate();

  const {
    webcamRef,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showRecordForm,
    setShowRecordForm,
    showAgency,
    setShowAgency,
    loading,
    filteredRecords,
    availableCubes,
    recordFormData,
    setRecordFormData,
    agencyForm,
    setAgencyForm,
    handleSubmitRecord,
    handleSubmitAgency,
    capturePhoto,
    retakePhoto,
    downloadAgencyPDF,
    downloadRecordsPDF,
    facingMode,
    setFacingMode,
  } = useWealthCenter();

  return (
    <div className="h-full">
      {/* Header */}
      <WealthHeader activeTab={activeTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs + Actions */}
        <WealthTabsActions
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRecordForm={() => setShowRecordForm(true)}
          onDownloadPdf={downloadRecordsPDF}
          onMccAction={() => navigate("/supervisor/mokhata")}
          onMrfAction={() => setShowAgency(true)}
        />

        {/* Search & Filter */}
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Records */}
        <RecordsList
          loading={loading}
          records={filteredRecords}
          activeTab={activeTab}
        />
      </div>

      {/* Add Record Modal */}
      <FormModal
        title={`${getWealthCenterFullName(activeTab)} Add Record`}
        isOpen={showRecordForm}
        onClose={() => setShowRecordForm(false)}
        onSubmit={handleSubmitRecord}
      >
        <InputField
          label="Wealth Center"
          value={recordFormData.wealthCenter}
          readOnly
        />

        <InputField
          label="Supervisor Name"
          value={recordFormData.supervisorName}
          onChange={(v) =>
            setRecordFormData((p) => ({ ...p, supervisorName: v }))
          }
        />

        <InputField
          label="Contact Number"
          type="tel"
          value={recordFormData.phoneNo}
          onChange={(v) =>
            setRecordFormData((p) => ({
              ...p,
              phoneNo: v.replace(/\D/g, "").slice(0, 10),
            }))
          }
          error={
            recordFormData.phoneNo && !validatePhone(recordFormData.phoneNo)
              ? "Contact number must be exactly 10 digits."
              : ""
          }
          maxLength={10}
        />

        {activeTab === "MCC" && (
          <>
            <InputField
              label="Wet Waste (kg)"
              type="number"
              min={0}
              required={false}
              value={recordFormData.wetWasteKg}
              onChange={(v) =>
                setRecordFormData((p) => ({ ...p, wetWasteKg: v }))
              }
            />

            <InputField
              label="Dry Waste (kg)"
              type="number"
              min={0}
              required={false}
              value={recordFormData.dryWasteKg}
              onChange={(v) =>
                setRecordFormData((p) => ({ ...p, dryWasteKg: v }))
              }
            />
          </>
        )}

        <SelectField
          label="Cube Number"
          value={recordFormData.cubeNumber}
          onChange={(v) => setRecordFormData((p) => ({ ...p, cubeNumber: v }))}
          options={availableCubes}
        />

        <CameraField
          photo={recordFormData.photo}
          onCapture={capturePhoto}
          onRetake={retakePhoto}
          webcamRef={webcamRef}
          facingMode={facingMode}
          setFacingMode={setFacingMode}
        />

        {!canSubmitRecord(recordFormData) && (
          <div className="text-center py-2 text-red-600 font-medium">
            Please fill all required fields and capture an image.
          </div>
        )}
      </FormModal>

      {/* Agency Modal */}
      <FormModal
        title="MRF Agency Sell (KG)"
        isOpen={showAgency}
        onClose={() => setShowAgency(false)}
        onSubmit={handleSubmitAgency}
        extraActions={
          <button
            type="button"
            onClick={downloadAgencyPDF}
            className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Download PDF
          </button>
        }
      >
        <AgencyFormFields
          agencyForm={agencyForm}
          setAgencyForm={setAgencyForm}
          materials={AGENCY_MATERIALS}
        />
      </FormModal>
    </div>
  );
}

export default WealthCenter;
