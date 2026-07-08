// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getWealthCenterFullName } from "../utils/wealthCenterHelpers";

/* ✅ BACKEND API ONLY */
import api from "../../../../api/api";

/* PDF */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* Config + Helpers */
import { MCC_CUBES, MRF_CUBES } from "../config/wealthCenterConfig";
import { canSubmitRecord, formatDateTime, formatRecordDate } from "../utils/wealthCenterHelpers";

export const useWealthCenter = () => {
  const webcamRef = useRef(null);

  const [activeTab, setActiveTab] = useState("MCC");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showAgency, setShowAgency] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  const [mccRecords, setMccRecords] = useState([]);
  const [mrfRecords, setMrfRecords] = useState([]);
  const [agencySales, setAgencySales] = useState([]);

  const [loading, setLoading] = useState(false);

  const [recordFormData, setRecordFormData] = useState({
    wealthCenter: "Polosara NAC",
    supervisorName: "",
    phoneNo: "",
    cubeNumber: "",
    wetWasteKg: "",
    dryWasteKg: "",
    photo: null,
  });

  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    material: "",
    weightKg: "",
    ratePerKg: "",
  });

  /* ================= Load Data ================= */
  const loadAll = async () => {
    try {
      setLoading(true);

      const [mccRes, mrfRes, salesRes] = await Promise.all([
        api.get("/mcc/all-mcc-records"),
        api.get("/mrf/all-mrf-records"),
        api.get("/mrf/all-agency-sales"), // ✅ BACKEND ONLY
      ]);

      setMccRecords(mccRes.data?.data || []);
      setMrfRecords(mrfRes.data?.data || []);
      setAgencySales(salesRes.data?.data || []);
    } catch (err) {
      console.error("WealthCenter load error:", err);
      toast.error("Failed to load records. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= Cube Logic ================= */
  const filledMcc = useMemo(
    () => new Set((mccRecords || []).map((r) => Number(r.cubeNumber))),
    [mccRecords]
  );

  const filledMrf = useMemo(
    () => new Set((mrfRecords || []).map((r) => Number(r.cubeNumber))),
    [mrfRecords]
  );

  const availableCubes = useMemo(() => {
    if (activeTab === "MCC") {
      return MCC_CUBES.filter((c) => !filledMcc.has(Number(c)));
    }
    return MRF_CUBES.filter((c) => !filledMrf.has(Number(c)));
  }, [activeTab, filledMcc, filledMrf]);

  /* ================= Photo ================= */
  const capturePhoto = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setRecordFormData((p) => ({ ...p, photo: img }));
  };

  const retakePhoto = () => {
    setRecordFormData((p) => ({ ...p, photo: null }));
  };

  /* ================= Submit MCC/MRF Record ================= */
  const handleSubmitRecord = async (e) => {
    e.preventDefault();

    if (!canSubmitRecord(recordFormData)) {
      toast.warning("Fill all fields and capture image!");
      return;
    }

    try {
      const fd = new FormData();

      fd.append("wealthCenter", recordFormData.wealthCenter);
      fd.append("supervisorName", recordFormData.supervisorName);
      fd.append("contactNumber", recordFormData.phoneNo);
      fd.append("cubeNumber", String(recordFormData.cubeNumber));
      if (activeTab === "MCC") {
        fd.append("wetWasteKg", String(recordFormData.wetWasteKg));
        fd.append("dryWasteKg", String(recordFormData.dryWasteKg));
      }
      fd.append("status", "Stored");
      fd.append("dateSubmitted", formatDateTime());

      // base64 -> file
      const blob = await (await fetch(recordFormData.photo)).blob();
      const file = new File([blob], `record-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      fd.append("image", file);

      if (activeTab === "MCC") {
        await api.post("/mcc/create-mcc-record", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/mrf/create-mrf-record", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(`${getWealthCenterFullName(activeTab)} record submitted successfully ✅`);


      await loadAll();
      setShowRecordForm(false);

      setRecordFormData({
        wealthCenter: "Polosara NAC",
        supervisorName: "",
        phoneNo: "",
        cubeNumber: "",
        wetWasteKg: "",
        dryWasteKg: "",
        photo: null,
      });
    } catch (err) {
      console.error("Submit record error:", err);
      toast.error(err?.response?.data?.message || "Submit failed!");
    }
  };

  /* ================= Agency Submit (BACKEND ONLY) ================= */
  const handleSubmitAgency = async (e) => {
    e.preventDefault();

    try {
      const weight = Number(agencyForm.weightKg);
      const rate = Number(agencyForm.ratePerKg);

      if (!agencyForm.agencyName.trim())
        return toast.warning("Agency name is required!");
      if (!agencyForm.material) return toast.warning("Select material!");
      if (!weight || weight <= 0) return toast.warning("Enter valid weight!");
      if (!rate || rate <= 0) return toast.warning("Enter valid rate!");

      const payload = {
        agencyName: agencyForm.agencyName,
        material: agencyForm.material,
        weightKg: weight,
        ratePerKg: rate,
        totalAmount: weight * rate,
        dateSubmitted: formatDateTime(),
      };

      await api.post("/mrf/create-agency-sale", payload); // ✅ BACKEND ONLY

      toast.success("Agency Sale stored successfully ✅");

      setAgencyForm({
        agencyName: "",
        material: "",
        weightKg: "",
        ratePerKg: "",
      });

      const salesRes = await api.get("/mrf/all-agency-sales");
      setAgencySales(salesRes.data?.data || []);

      setShowAgency(false);
    } catch (err) {
      console.error("Agency submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to store Agency Sale ❌");
    }
  };

  /* ================= Filtered Records ================= */
  const currentRecords = activeTab === "MCC" ? mccRecords : mrfRecords;

  const filteredRecords = useMemo(() => {
    return (currentRecords || []).filter((r) => {
      const matchesSearch =
        r.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r._id || r.id || "").includes(searchTerm) ||
        String(r.cubeNumber).includes(searchTerm);

      const matchesStatus = statusFilter === "All" || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [currentRecords, searchTerm, statusFilter]);

  /* ================= PDF DOWNLOAD (AGENCY SALES) ================= */
  const downloadAgencyPDF = () => {
    if (!agencySales || agencySales.length === 0) {
      toast.info("No Agency Sales records found!");
      return;
    }

    const doc = new jsPDF("portrait");

    doc.setFontSize(16);
    doc.text("MRF Agency Sales Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 23);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Agency", "Material", "Weight(KG)", "Rate(₹)", "Total(₹)", "Date"]],
      body: agencySales
        .slice()
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .map((s, i) => [
          i + 1,
          s.agencyName || "N/A",
          s.material || "N/A",
          s.weightKg || 0,
          s.ratePerKg || 0,
          s.totalAmount || 0,
          s.dateSubmitted ? new Date(s.dateSubmitted).toLocaleString() : "N/A",
        ]),
      styles: { fontSize: 9 },
    });

    doc.save(`agency-sales-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const downloadRecordsPDF = () => {
    const records = activeTab === "MCC" ? mccRecords : mrfRecords;
    const title = `${getWealthCenterFullName(activeTab)} Records Report`;
    const filename = `${activeTab.toLowerCase()}-records-${new Date().toISOString().slice(0, 10)}.pdf`;

    if (!records || records.length === 0) {
      toast.info(`No ${activeTab} records found!`);
      return;
    }

    const doc = new jsPDF("portrait");
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 23);

    const head =
      activeTab === "MCC"
        ? [["#", "Cube", "Supervisor", "Contact", "Wet(KG)", "Dry(KG)", "Status", "Date"]]
        : [["#", "Cube", "Supervisor", "Contact", "Status", "Date"]];

    const body = records
      .slice()
      .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
      .map((r, i) => {
        if (activeTab === "MCC") {
          return [
            i + 1,
            r.cubeNumber || "N/A",
            r.supervisorName || "N/A",
            r.contactNumber || r.phoneNo || "N/A",
            r.wetWasteKg ?? 0,
            r.dryWasteKg ?? 0,
            r.status || "Stored",
            formatRecordDate(r),
          ];
        }

        return [
          i + 1,
          r.cubeNumber || "N/A",
          r.supervisorName || "N/A",
          r.contactNumber || r.phoneNo || "N/A",
          r.status || "Stored",
          formatRecordDate(r),
        ];
      });

    autoTable(doc, {
      startY: 30,
      head,
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [248, 186, 0], textColor: 20 },
      columnStyles: {
        0: { cellWidth: 10 },
      },
    });

    doc.save(filename);
  };

  const resetAll = async () => {
  try {
    const confirmReset = window.confirm(
      "Are you sure you want to RESET MCC + MRF + Agency Sales?"
    );

    if (!confirmReset) return;

    setLoading(true);

    await api.delete("/mrf/reset-wealth-center"); // ✅ only this

    toast.success("Reset successful ✅");
    await loadAll();
  } catch (err) {
    console.error("Reset error:", err);
    toast.error(err?.response?.data?.message || "Reset failed ❌");
  } finally {
    setLoading(false);
  }
};



  return {
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
    resetAll,
    facingMode,
    setFacingMode,
  };
};
