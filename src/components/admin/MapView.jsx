// @ts-nocheck
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import api from '../../api/api';

const TRAIL_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map bounds and centering
// const MapController = ({ vehicles, selectedVehicle }) => {
//   const map = useMap();

//   // Fit map to show all vehicles on initial load or when vehicles change
//   useEffect(() => {
//     if (vehicles.length > 0) {
//       const bounds = L.latLngBounds(vehicles.map(v => [v.location.lat, v.location.lng]));
//       if (vehicles.length === 1) {
//         map.setView(bounds.getCenter(), 15);
//       } else {
//         map.fitBounds(bounds, { padding: [50, 50], maxZoom: 20 });
//       }
//     }
//   }, [vehicles, map]);

//   useEffect(() => {
//     if (selectedVehicle && selectedVehicle.location) {
//       map.flyTo([selectedVehicle.location.lat, selectedVehicle.location.lng], 15, {
//         duration: 1.5
//       });
//       setTimeout(() => {
//         map.eachLayer((layer) => {
//           if (layer instanceof L.Marker) {
//             const markerLatLng = layer.getLatLng();
//             if (markerLatLng.lat === selectedVehicle.location.lat &&
//                 markerLatLng.lng === selectedVehicle.location.lng) {
//               layer.openPopup();
//             }
//           }
//         });
//       }, 1600);
//     }
//   }, [selectedVehicle, map]);

//   return null;
// };


const MapController = ({ vehicles, selectedVehicle }) => {
  const map = useMap();
  const hasZoomed = useRef(false); // ✅ flag

  // ✅ Run only first time
  useEffect(() => {
    if (!hasZoomed.current && vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.location.lat, v.location.lng]),
      );

      if (vehicles.length === 1) {
        map.setView(bounds.getCenter(), 15);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 20 });
      }

      hasZoomed.current = true; // ✅ prevent future zooms
    }
  }, [vehicles, map]);

  // ✅ Keep this for selected vehicle (this should still zoom when clicked)
  useEffect(() => {
    if (selectedVehicle && selectedVehicle.location) {
      map.flyTo(
        [selectedVehicle.location.lat, selectedVehicle.location.lng],
        15,
        { duration: 1.5 },
      );

      setTimeout(() => {
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const markerLatLng = layer.getLatLng();
            if (
              markerLatLng.lat === selectedVehicle.location.lat &&
              markerLatLng.lng === selectedVehicle.location.lng
            ) {
              layer.openPopup();
            }
          }
        });
      }, 1600);
    }
  }, [selectedVehicle, map]);

  return null;
};

// AnimatedMarker component that interpolates lat/lng positions smoothly
const AnimatedMarker = ({ position, children, ...props }) => {
  const [currentPos, setCurrentPos] = useState(position);
  const prevPositionRef = useRef(position);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const duration = 3000; // 3 seconds smooth movement

  useEffect(() => {
    const isValidPos =
      Array.isArray(position) &&
      position.length === 2 &&
      !isNaN(position[0]) &&
      !isNaN(position[1]);

    if (!isValidPos) return;

    // If the target position is different from the previous recorded target, animate
    const hasPositionChanged =
      prevPositionRef.current &&
      (prevPositionRef.current[0] !== position[0] ||
        prevPositionRef.current[1] !== position[1]);

    if (hasPositionChanged) {
      const startLat = prevPositionRef.current[0];
      const startLng = prevPositionRef.current[1];
      const targetLat = position[0];
      const targetLng = position[1];

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

        const currentLat = startLat + (targetLat - startLat) * progress;
        const currentLng = startLng + (targetLng - startLng) * progress;

        setCurrentPos([currentLat, currentLng]);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          prevPositionRef.current = position;
          startTimeRef.current = null;
        }
      };

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setCurrentPos(position);
      prevPositionRef.current = position;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position]);

  const isValidPos =
    Array.isArray(currentPos) &&
    currentPos.length === 2 &&
    !isNaN(currentPos[0]) &&
    !isNaN(currentPos[1]);

  if (!isValidPos) return null;

  return (
    <Marker position={currentPos} {...props}>
      {children}
    </Marker>
  );
};

const MapView = ({ vehicles = [], selectedVehicle = null }) => {
  const [mapType, setMapType] = useState('hybrid');
  const [showTrails, setShowTrails] = useState(true);
  const [vehicleTrailsState, setVehicleTrailsState] = useState({});
  const [vehicleRoadTrailsState, setVehicleRoadTrailsState] = useState({});
  const vehicleTrails = useRef({});

  const MAX_OSRM_POINTS = 40;

  const isValidTrailPoint = (point) =>
    point && typeof point === 'object' &&
    Number.isFinite(Number(point.lat)) &&
    Number.isFinite(Number(point.lng)) &&
    Number.isFinite(new Date(point.timestamp).getTime());

  const getTrailPositions = (trail) =>
    Array.isArray(trail)
      ? trail
        .filter((point) => point && typeof point === 'object')
        .map((point) =>
          Array.isArray(point)
            ? point
            : [Number(point.lat), Number(point.lng)],
        )
      : [];

  const buildOsrmRouteUrl = (positions) => {
    const coords = positions
      .slice(-MAX_OSRM_POINTS)
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(';');

    return `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  };

  const normalizeTrail = (trail) => {
    if (Array.isArray(trail)) {
      return trail.filter(isValidTrailPoint);
    }

    if (trail && typeof trail === 'object' && isValidTrailPoint(trail)) {
      return [trail];
    }

    return [];
  };

  const trimTrail = (trail, now) =>
    normalizeTrail(trail).filter(
      (point) => now - point.timestamp <= TRAIL_RETENTION_MS,
    );

  const saveTimeoutRef = useRef(null);

  const persistTrails = async (trails) => {
    try {
      await api.post("/tracking/trails", { trails });
    } catch (error) {
      console.warn("Failed to persist vehicle trails", error);
    }
  };

  const scheduleTrailSave = (trails) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      persistTrails(trails);
      saveTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    const loadTrails = async () => {
      try {
        const response = await api.get("/tracking/trails");
        if (response?.data?.success && response?.data?.data) {
          const storedTrails = response.data.data;
          
          // Clean up any corrupted trails saved from before the _id fix
          if (storedTrails["undefined"]) {
            delete storedTrails["undefined"];
          }
          
          vehicleTrails.current = storedTrails;
          setVehicleTrailsState({ ...storedTrails });
        }
      } catch (error) {
        console.warn("Failed to load vehicle trails", error);
      }
    };

    loadTrails();

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Keep a rolling 24-hour movement history for each vehicle.
  useEffect(() => {
    const now = Date.now();

    vehicles.forEach(vehicle => {
      const vid = vehicle._id || vehicle.id;
      if (!vid) return;

      if (vehicle.location) {
        if (!Array.isArray(vehicleTrails.current[vid])) {
          vehicleTrails.current[vid] = [];
        }

        const trail = normalizeTrail(vehicleTrails.current[vid]);
        const lastPoint = trail[trail.length - 1];

        const pointTimestamp = vehicle.lastUpdated
          ? new Date(vehicle.lastUpdated).getTime()
          : now;

        if (
          !lastPoint ||
          lastPoint.lat !== vehicle.location.lat ||
          lastPoint.lng !== vehicle.location.lng
        ) {
          trail.push({
            lat: vehicle.location.lat,
            lng: vehicle.location.lng,
            timestamp: Number.isNaN(pointTimestamp) ? now : pointTimestamp,
          });
        }

        vehicleTrails.current[vid] = trail.filter(
          point => now - point.timestamp <= TRAIL_RETENTION_MS
        );
      }
    });

    Object.keys(vehicleTrails.current).forEach((vehicleId) => {
      vehicleTrails.current[vehicleId] = normalizeTrail(vehicleTrails.current[vehicleId]).filter(
        point => now - point.timestamp <= TRAIL_RETENTION_MS,
      );
    });

    setVehicleTrailsState({ ...vehicleTrails.current });
    if (Object.keys(vehicleTrails.current).length > 0) {
      scheduleTrailSave(vehicleTrails.current);
    }
  }, [vehicles]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadRoadSnappedTrails = async () => {
      const entries = Object.entries(vehicleTrailsState);
      if (entries.length === 0) {
        setVehicleRoadTrailsState({});
        return;
      }

      const snappedEntries = await Promise.all(
        entries.map(async ([vehicleId, trail]) => {
          const positions = getTrailPositions(trail);
          if (positions.length <= 1) {
            return [vehicleId, positions];
          }

          const url = buildOsrmRouteUrl(positions);
          try {
            const response = await fetch(url, { signal });
            if (!response.ok) {
              throw new Error(`OSRM response status ${response.status}`);
            }

            const data = await response.json();
            if (!data.routes?.[0]?.geometry?.coordinates) {
              throw new Error('OSRM route geometry missing');
            }

            const roadPositions = data.routes[0].geometry.coordinates.map(
              ([lng, lat]) => [lat, lng],
            );

            return [vehicleId, roadPositions.length > 1 ? roadPositions : positions];
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.warn('OSRM road snapping failed for vehicle', vehicleId, error);
            }
            return [vehicleId, positions];
          }
        }),
      );

      setVehicleRoadTrailsState(Object.fromEntries(snappedEntries));
    };

    if (showTrails) {
      loadRoadSnappedTrails().catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Failed to load road-snapped trails', error);
        }
      });
    } else {
      setVehicleRoadTrailsState({});
    }

    return () => controller.abort();
  }, [vehicleTrailsState, showTrails]);

  // ✅ ONLY 3 RELIABLE MAP TYPES - Terrain REMOVED
  const mapTiles = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: '🛰️ Satellite'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: '🗺️ Street'
    },
    hybrid: {
      url: 'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      attribution: 'Google',
      name: '🟫 Hybrid'
    }
  };

  // Create custom vehicle icons with animated effect for running vehicles
  const createVehicleIcon = (vehicle) => {
    const colors = {
      running: '#10b981',
      standing: '#3b82f6',
      stopped: '#f59e0b',
      dataNotRetrieving: '#6b7280'
    };

    const color = colors[vehicle.status] || colors.stopped;
    const isRunning = vehicle.status === 'running';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="position: relative; width: 40px; height: 40px;">
        ${isRunning ? `<div style="position: absolute; width: 40px; height: 40px; background: ${color}; border-radius: 50%; opacity: 0.3; animation: pulse 2s infinite;"></div>` : ''}
        <div style="position: absolute; width: 36px; height: 36px; background: ${color}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.4); top: 2px; left: 2px;">🚛</div>
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background: ${color}; color: white; padding: 2px 6px; border-radius: 8px; font-size: 9px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${vehicle.speed !== null ? vehicle.speed + ' km/h' : 'N/A'}</div>
      </div>
      <style>@keyframes pulse { 0% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.5); opacity: 0; } 100% { transform: scale(1); opacity: 0.3; } }</style>`,
      iconSize: [40, 48],
      iconAnchor: [20, 24],
      popupAnchor: [0, -24]
    });
  };

  const filteredVehicles = vehicles.filter(v => v.location);
  const vehicleLabels = filteredVehicles.reduce((acc, v) => {
    const vid = v._id || v.id;
    acc[vid] = v.registrationNumber || vid;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🗺️ Live Vehicle Tracking Map</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time location updates • 100% Free</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-700">Live</span>
          </div>

          {/* Map type buttons - Terrain REMOVED */}
          {Object.entries(mapTiles).map(([key, tile]) => (
            <button
              key={key}
              onClick={() => setMapType(key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${mapType === key
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {tile.name}
            </button>
          ))}

          {/* Show trails toggle */}
          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${showTrails
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            title="Show vehicle movement trails"
          >
            📍 Trails
          </button>

          {/* Clear trails button */}
          {showTrails && (
            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to clear all previous vehicle routes?")) {
                  try {
                    await api.delete("/tracking/trails");
                    vehicleTrails.current = {};
                    setVehicleTrailsState({});
                    setVehicleRoadTrailsState({});
                  } catch (error) {
                    console.error("Failed to clear vehicle trails", error);
                  }
                }
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-all"
              title="Clear previous vehicle routes"
            >
              🗑️ Clear Trails
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[19.9017, 84.7985]}
        zoom={12}
        style={{ width: '100%', height: '500px', borderRadius: '12px', zIndex: 0 }}
      >
        {/* Dynamic Tile Layer - Terrain REMOVED */}
        <TileLayer
          url={mapTiles[mapType].url}
          attribution={mapTiles[mapType].attribution}
          maxZoom={19}
        />

        {/* Map Controller for auto-centering */}
        <MapController
          vehicles={filteredVehicles}
          selectedVehicle={selectedVehicle}
        />

        {/* Vehicle Markers */}
        {filteredVehicles.map((vehicle, index) => (
          <AnimatedMarker
            key={vehicle.id || vehicle._id || index}
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={createVehicleIcon(vehicle)}
          >
            <Popup autoPan closeButton>
              <div className="p-2 min-w-55">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">
                    {vehicle.registrationNumber}
                  </h3>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${vehicle.status === 'running'
                        ? 'bg-emerald-500 text-white'
                        : vehicle.status === 'standing'
                          ? 'bg-blue-500 text-white'
                          : vehicle.status === 'stopped'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-500 text-white'
                      }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">📍 Ward:</span>{' '}
                    {vehicle.assignedWard}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-semibold">⚡ Speed:</span>{' '}
                    {vehicle.speed != null ? `${vehicle.speed} km/h` : 'N/A'}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-semibold">📶 Signal:</span>{' '}
                    {vehicle.signalStrength ?? 'N/A'}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-semibold">🔑 Ignition:</span>{' '}
                    {vehicle.ignitionOn ? 'ON' : 'OFF'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">🗺️ Location:</span>{' '}
                    {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-2 border-t pt-2">
                  <p className="text-xs text-gray-500">
                    Last update:{' '}
                    {new Date(vehicle.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </Popup>
          </AnimatedMarker>
        ))}

        {showTrails &&
          Object.entries(vehicleTrailsState).map(([vehicleId, trail]) => {
            const rawPositions = getTrailPositions(trail);
            const roadPositions = vehicleRoadTrailsState[vehicleId];
            const positions =
              Array.isArray(roadPositions) && roadPositions.length > 1
                ? roadPositions
                : rawPositions;
            const label = vehicleLabels[vehicleId] || vehicleId;

            return positions.length > 1 ? (
              <Polyline
                key={`${vehicleId}-trail`}
                positions={positions}
                pathOptions={{
                  color: '#2563eb',
                  weight: 6,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              >
                {/* <Tooltip direction="center" permanent offset={[0, 0]}>
                  {label}
                </Tooltip> */}
                <Popup>
                  <div className="text-sm font-semibold">Vehicle</div>
                  <div>{label}</div>
                  <div className="text-xs text-gray-500">Click to identify the vehicle line.</div>
                </Popup>
              </Polyline>
            ) : null;
          })}
      </MapContainer>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Running</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Standing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Stopped</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-700 font-semibold">Offline</span>
        </div>
        {showTrails && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-1 bg-blue-600 opacity-80 rounded-full"></div>
            <span className="text-gray-700 font-semibold">24-Hour Vehicle Trail</span>
          </div>
        )}
      </div>

      {/* Info Banner - Updated */}
      <div className="mt-4 bg-linear-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-gray-700 text-center">
          ✨ <span className="font-semibold">100% Free Maps</span> • Esri Satellite, OpenStreetMap, Google Hybrid • No API Keys Required
        </p>
      </div>
    </div>
  );
};

export default MapView;
