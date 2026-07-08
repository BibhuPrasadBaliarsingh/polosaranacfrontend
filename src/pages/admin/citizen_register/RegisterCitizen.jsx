import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllCitizenPhones,
  updateCitizenWard,
} from "../../../api/admin/citizen.api.js";
import { fetchAllWards } from "../../../api/admin/ward.api.js";

const RegisterCitizen = () => {
  const [citizens, setCitizens] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingCitizenId, setSavingCitizenId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citizenResponse, wardResponse] = await Promise.all([
          getAllCitizenPhones(),
          fetchAllWards(),
        ]);

        if (citizenResponse.success) {
          setCitizens(citizenResponse.citizens || []);
        } else {
          setError(citizenResponse.message);
        }

        setWards(wardResponse?.data?.data || []);
      } catch (err) {
        setError("Failed to fetch citizens");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWardChange = (citizenId, wardName) => {
    setCitizens((prev) =>
      prev.map((citizen) =>
        citizen.id === citizenId ? { ...citizen, wardName } : citizen,
      ),
    );
  };

  const handleSaveWard = async (citizenId, wardName) => {
    setSavingCitizenId(citizenId);
    try {
      const response = await updateCitizenWard(citizenId, wardName);
      if (!response.success) {
        toast.error(response.message || "Failed to update citizen ward");
        return;
      }

      toast.success("Citizen ward updated");
    } catch (err) {
      toast.error("Failed to update citizen ward");
    } finally {
      setSavingCitizenId("");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600">
              Registered Citizen List
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Assign each registered number to its ward for vehicle entry alerts
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Citizen Table */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading citizens...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Ward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citizens.length > 0 ? (
                  citizens.map((citizen, index) => (
                    <tr key={citizen.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {citizen.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {citizen.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <select
                          value={citizen.wardName || ""}
                          onChange={(e) =>
                            handleWardChange(citizen.id, e.target.value)
                          }
                          className="min-w-[170px] rounded-lg border border-gray-300 px-3 py-2"
                        >
                          <option value="">Select ward</option>
                          {wards.map((ward) => (
                            <option key={ward._id} value={ward.wardName}>
                              {ward.wardName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {citizen.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() =>
                            handleSaveWard(citizen.id, citizen.wardName || "")
                          }
                          disabled={savingCitizenId === citizen.id}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {savingCitizenId === citizen.id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No registered citizens found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCitizen;
