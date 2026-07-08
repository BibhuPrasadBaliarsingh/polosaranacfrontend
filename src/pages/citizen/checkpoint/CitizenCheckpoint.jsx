import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import api from "../../../api/api";

/* ===============================
   FIX LEAFLET ICON ISSUE
================================ */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ===============================
   CATEGORY CONFIG
================================ */
const categoryConfig = {
  toilet: { emoji: "🚻", color: "#3B82F6", label: "Available" },
  park: { emoji: "🌳", color: "#22C55E", label: "Open" },
  hospital: { emoji: "🏥", color: "#EF4444", label: "24/7" },
  temple: { emoji: "🛕", color: "#F59E0B", label: "Open" },
  school: { emoji: "🏫", color: "#8B5CF6", label: "Active" },
  police: { emoji: "👮", color: "#0EA5E9", label: "On Duty" },
  streetlight: { emoji: "💡", color: "#FBBF24", label: "Working" },
  tourist: { emoji: "📸", color: "#EC4899", label: "Open" },
};

/* ===============================
   PIN-STYLE MAP ICON WITH CHECKPOINT NAME
================================ */
const createVehicleStyleIcon = (emoji, color, checkpointName) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:0px;
      ">
        <div style="
          width:40px;
          height:40px;
          background:${color};
          border:3px solid white;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:20px;
          box-shadow:0 4px 8px rgba(0,0,0,0.4);
          position:relative;
          z-index:1;
        ">
          ${emoji}
        </div>
        <div style="
          width:0;
          height:0;
          border-left:12px solid transparent;
          border-right:12px solid transparent;
          border-top:15px solid ${color};
          margin-top:-2px;
        "></div>
        <div style="
          background:white;
          color:${color};
          padding:3px 8px;
          border-radius:4px;
          font-size:11px;
          font-weight:bold;
          border:2px solid ${color};
          white-space:nowrap;
          margin-top:4px;
          box-shadow:0 2px 4px rgba(0,0,0,0.2);
        ">
          ${checkpointName}
        </div>
      </div>
    `,
    iconSize: [60, 90],
    iconAnchor: [30, 85],
    popupAnchor: [0, -40],
  });

/* ===============================
   MOCK CHECKPOINTS DATA
================================ */
const mockCheckpoints = [
  {
    _id: "1",
    name: "Town Park",
    category: "park",
    latitude: 19.8100,
    longitude: 84.1050,
    address: "Main Road, Polosara",
    status: "Open",
  },
  {
    _id: "2",
    name: "Polosara CHC",
    category: "hospital",
    latitude: 19.8130,
    longitude: 84.1080,
    address: "Hospital Road, Polosara",
    status: "24/7",
  },
  {
    _id: "3",
    name: "Bus Stand Toilet",
    category: "toilet",
    latitude: 19.811076,
    longitude: 84.787998,
    address: "Bus Stand Area",
    status: "Available",
  },
  {
    _id: "4",
    name: "Maa Budhi Thakurani Temple",
    category: "temple",
    latitude: 19.8060,
    longitude: 84.1000,
    address: "Temple Road, Polosara",
    status: "Open",
  },
  {
    _id: "5",
    name: "Polosara High School",
    category: "school",
    latitude: 19.8150,
    longitude: 84.1070,
    address: "School Lane, Polosara",
    status: "Active",
  },
  {
    _id: "6",
    name: "Polosara Police Station",
    category: "police",
    latitude: 19.8070,
    longitude: 84.1040,
    address: "Station Road, Polosara",
    status: "On Duty",
  },
  {
    _id: "7",
    name: "Market Area Lights",
    category: "streetlight",
    latitude: 19.8090,
    longitude: 84.1010,
    address: "Market Complex",
    status: "Working",
  },
  {
    _id: "8",
    name: "Polosara Tourist Info",
    category: "tourist",
    latitude: 19.8120,
    longitude: 84.1100,
    address: "NH-59, Polosara",
    status: "Open",
  },
  {
    _id: "9",
    name: "Children's Park",
    category: "park",
    latitude: 19.8050,
    longitude: 84.1060,
    address: "Residential Area",
    status: "Open",
  },
  {
    _id: "10",
    name: "Primary Health Center",
    category: "hospital",
    latitude: 19.8160,
    longitude: 84.1030,
    address: "North Polosara",
    status: "24/7",
  },
  {
    _id: "11",
    name: "Faecal Sludge Treatment Plant",
    category: "hospital",
    latitude: 19.808459,
    longitude:  84.809148,
    address: "North Polosara",
    status: "24/7",
  },
  {
    _id: "12",
    name: "Wealthcentre",
    category: "hospital",
    latitude: 19.816728,
    longitude:  84.794758,
    address: "North Polosara",
    status: "24/7",
  }
];

/* ===============================
   COMPONENT
================================ */
export default function CitizenCheckpoint() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [center, setCenter] = useState([19.8100, 84.1050]); // Polosara, Odisha

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/api/checkpoints");
        setCheckpoints(res.data || []);

        const initFilters = {};
        res.data.forEach((c) => (initFilters[c.category] = true));
        setFilters(initFilters);
      } catch (err) {
        console.error("Failed to load checkpoints, using mock data:", err);
        // Use mock data if API fails
        setCheckpoints(mockCheckpoints);
        const initFilters = {};
        mockCheckpoints.forEach((c) => (initFilters[c.category] = true));
        setFilters(initFilters);
      }
    };

    loadData();
  }, []);

  /* ===============================
     LOCATE ME
  ================================ */
  const locateMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  /* ===============================
     FILTER + SEARCH
  ================================ */
  const visibleCheckpoints = checkpoints.filter(
    (c) =>
      filters[c.category] &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-700">
          Polosara Checkpoints Map
        </h1>
        <p className="text-sm text-gray-600">
          Track public facilities and infrastructure in Polosara
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow">
        <input
          type="text"
          placeholder="Search checkpoint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm w-64"
        />

        <button
          onClick={locateMe}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm"
        >
          Locate Me
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.keys(categoryConfig).map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters[cat] || false}
              onChange={() =>
                setFilters({ ...filters, [cat]: !filters[cat] })
              }
            />
            <span>{categoryConfig[cat].emoji}</span>
            <span className="capitalize">{cat}</span>
          </label>
        ))}
      </div>

      {/* MAP */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <MapContainer center={center} zoom={13} className="h-[520px] w-full">
          <TileLayer
            attribution="Tiles © Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {visibleCheckpoints.map((c) => {
            const config = categoryConfig[c.category];

            return (
              <Marker
                key={c._id}
                position={[c.latitude, c.longitude]}
                icon={createVehicleStyleIcon(
                  config.emoji,
                  config.color,
                  c.name
                )}
              >
                <Popup>
                  <div className="text-sm space-y-1">
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="capitalize">Category: {c.category}</p>
                    <p className="text-xs text-gray-500">📍 {c.address}</p>
                    <p className="font-semibold">Status: {c.status || categoryConfig[c.category].label}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
