export const formatDateTime = () => new Date().toISOString();

export const validatePhone = (value) => /^\d{10}$/.test(value);

export const canSubmitRecord = (form) => {
  return (
    form.supervisorName.trim() &&
    validatePhone(form.phoneNo) &&
    form.cubeNumber &&
    form.photo
  );
};

export const getRecordDateValue = (record) => {
  return record?.dateSubmitted || record?.createdAt || record?.updatedAt || "";
};

export const formatRecordDate = (record) => {
  const value = getRecordDateValue(record);
  if (!value) return "N/A";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

/* 🔽 ADD THIS BELOW (NEW FUNCTION) */
export const getWealthCenterFullName = (type) => {
  const map = {
    MCC: "Micro Composting Center",
    MRF: "Material Recovery Facility",
  };

  return map[type] || type;
};
