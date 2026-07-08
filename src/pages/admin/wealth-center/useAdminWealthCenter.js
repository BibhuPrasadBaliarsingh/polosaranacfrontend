import { useEffect, useState, useMemo } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export const useAdminWealthCenter = () => {
  const [mccRecords, setMccRecords] = useState([]);
  const [mrfRecords, setMrfRecords] = useState([]);
  const [agencySales, setAgencySales] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mccRes, mrfRes, salesRes] = await Promise.all([
        api.get("/mcc/all-mcc-records"),
        api.get("/mrf/all-mrf-records"),
        api.get("/mrf/all-agency-sales"),
      ]);

      setMccRecords(mccRes.data?.data || []);
      setMrfRecords(mrfRes.data?.data || []);
      setAgencySales(salesRes.data?.data || []);
    } catch (err) {
      console.error("Load error:", err);
      toast.error("Failed to load wealth center data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      totalMcc: mccRecords.length,
      totalMrf: mrfRecords.length,
      totalAgencySales: agencySales.length,
      totalWetWaste: mccRecords.reduce((sum, r) => sum + (r.wetWasteKg || 0), 0),
      totalDryWaste: mccRecords.reduce((sum, r) => sum + (r.dryWasteKg || 0), 0),
      totalAgencyValue: agencySales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    };
  }, [mccRecords, mrfRecords, agencySales]);

  return { mccRecords, mrfRecords, agencySales, loading, stats };
};
