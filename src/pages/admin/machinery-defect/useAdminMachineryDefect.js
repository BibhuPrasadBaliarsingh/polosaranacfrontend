import { useEffect, useState, useMemo } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export const useAdminMachineryDefect = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDefects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/machinery-defects");
      setDefects(res.data?.data || []);
    } catch (err) {
      console.error("Load error:", err);
      toast.error("Failed to load machinery defects ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefects();
  }, []);

  const stats = useMemo(() => {
    const started = defects.filter((d) => d.status === "started").length;
    const inProgress = defects.filter((d) => d.status === "inprogress").length;
    const repaired = defects.filter((d) => d.status === "repaired").length;

    return {
      total: defects.length,
      started,
      inProgress,
      repaired,
    };
  }, [defects]);

  return { defects, loading, stats };
};
