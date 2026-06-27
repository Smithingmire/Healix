import React from "react";
import { MapPin, Star, Compass, Phone } from "lucide-react";
import { TranslationSet } from "../translations";

interface Resource {
  id: string;
  name: string;
  address: string;
  distance: string;
  status: string;
  rating: number;
  phone: string;
  lat: number;
  lng: number;
}

interface HealthcareFinderProps {
  t: TranslationSet;
  isTrackingLocation: boolean;
  setIsTrackingLocation: (b: boolean) => void;
  isLocationLoading: boolean;
  locationErrorMessage: string | null;
  requestGPSLocation: () => void;
  citySearchStatus: string;
  manualCityInput: string;
  setManualCityInput: (s: string) => void;
  handleCityGeocode: (cityQuery: string) => void;
  selectedResourceCategory: string;
  setSelectedResourceCategory: (cat: string) => void;
  selectedResource: Resource | null;
  setSelectedResource: (res: Resource | null) => void;
  currentCategoryResources: Resource[];
  mapType: "radar" | "google";
  setMapType: (type: "radar" | "google") => void;
  userCoords: { lat: number; lng: number };
  activeCityName: string;
  showPhoneNumber: boolean;
  setShowPhoneNumber: (b: boolean) => void;
}

export default function HealthcareFinder({
  t,
  isTrackingLocation,
  setIsTrackingLocation,
  isLocationLoading,
  locationErrorMessage,
  requestGPSLocation,
  citySearchStatus,
  manualCityInput,
  setManualCityInput,
  handleCityGeocode,
  selectedResourceCategory,
  setSelectedResourceCategory,
  selectedResource,
  setSelectedResource,
  currentCategoryResources,
  mapType,
  setMapType,
  userCoords,
  activeCityName,
  showPhoneNumber,
  setShowPhoneNumber
}: HealthcareFinderProps) {
  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden h-auto md:h-full">
      
      {/* Left Column: Resource categories and listings */}
      <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col h-auto md:h-full bg-white dark:bg-slate-900 shrink-0">
        
        {/* Category selector */}
        <div className="p-4 border-b border-slate-150 dark:border-slate-800/80 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.nearbyResources}</span>
            <button
              type="button"
              disabled={isLocationLoading}
              onClick={requestGPSLocation}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer border-none ${
                isLocationLoading
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 animate-pulse"
                  : isTrackingLocation && !locationErrorMessage
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <MapPin className={`h-3 w-3 ${isLocationLoading ? "animate-spin" : isTrackingLocation && !locationErrorMessage ? "animate-pulse" : ""}`} />
              <span>
                {isLocationLoading 
                  ? "Acquiring GPS..." 
                  : isTrackingLocation && !locationErrorMessage 
                    ? "Live GPS Active" 
                    : "Track Live Location"}
              </span>
            </button>
          </div>
          
          {/* Manual City/Pincode Search Override */}
          <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-150 dark:border-slate-850 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Set Location (City or Pincode):</span>
              {citySearchStatus && (
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold animate-pulse">{citySearchStatus}</span>
              )}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Enter City or 6-digit Pincode (e.g., Pune, 411001)..."
                value={manualCityInput}
                onChange={(e) => setManualCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCityGeocode(manualCityInput);
                  }
                }}
                className="flex-1 px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-250"
              />
              <button
                type="button"
                onClick={() => handleCityGeocode(manualCityInput)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer border-none"
              >
                Set Location
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {["Hospitals", "Government Hospitals", "Primary Health Centers (PHC)", "Community Health Centers", "Emergency Services", "Ambulance Services", "Blood Banks", "Pharmacies"].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedResourceCategory(cat);
                  setSelectedResource(null);
                }}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-bold text-center truncate transition cursor-pointer border ${
                  selectedResourceCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
                title={cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resource List */}
        <div className="flex-1 max-h-[280px] md:max-h-none overflow-y-auto p-4 space-y-3 no-scrollbar">
          {locationErrorMessage ? (
            <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 p-4 rounded-2xl text-center space-y-2 shadow-xs">
              <span className="text-xl">📍</span>
              <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                {locationErrorMessage}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Please enable location access in your browser or device settings.
              </p>
            </div>
          ) : currentCategoryResources.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No resources found nearby.</div>
          ) : (
            currentCategoryResources.map(res => (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                  selectedResource?.id === res.id
                    ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/65"
                    : "bg-slate-50/40 hover:bg-slate-50 border-slate-200/50 dark:bg-slate-850/20 dark:hover:bg-slate-800/40 dark:border-slate-800/60"
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">{res.name}</h4>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md shrink-0">{res.distance}</span>
                </div>
                
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light truncate">{res.address}</p>
                
                <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400">{res.status}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{res.rating}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Interactive Map & Details card */}
      <div className="flex-1 flex flex-col h-auto md:h-full bg-slate-50 dark:bg-[#0B0F19] min-h-[450px] md:min-h-0">
        
        {/* 🗺️ INTERACTIVE MAP COMPONENT (SVG-based with pathing!) */}
        <div className="flex-1 relative min-h-[300px] overflow-hidden">
          {/* Floating Toggle Controls */}
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-md flex gap-1 z-10">
            <button
              type="button"
              onClick={() => setMapType("google")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border-none ${
                mapType === "google"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 bg-transparent"
              }`}
            >
              Google Map
            </button>
            <button
              type="button"
              onClick={() => setMapType("radar")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border-none ${
                mapType === "radar"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800 bg-transparent"
              }`}
            >
              Radar View
            </button>
          </div>

          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
            {mapType === "google" ? (
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  title="Google Maps"
                  className="w-full h-full border-0 absolute inset-0"
                  src={`https://maps.google.com/maps?q=${selectedResource ? encodeURIComponent(selectedResource.name + ", " + selectedResource.address) : `${userCoords.lat},${userCoords.lng}`}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ) : (
              <>
                {/* SVG Map grid, center is userCoords, markers around */}
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 500 450">
                  {/* Grid patterns */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-900/60" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Map concentric radar rings around user */}
                  <circle cx="250" cy="225" r="70" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" className="opacity-30" />
                  <circle cx="250" cy="225" r="140" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" className="opacity-20" />
                  <circle cx="250" cy="225" r="210" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" className="opacity-10" />

                  {/* Path route from User to selected Resource */}
                  {selectedResource && (
                    <>
                      <line
                        x1="250"
                        y1="225"
                        x2={250 + ((selectedResource.lat - userCoords.lat) * 8000)}
                        y2={225 - ((selectedResource.lng - userCoords.lng) * 8000)}
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        className="animate-[dash_10s_linear_infinite]"
                      />
                      {/* Route marker dot traveling */}
                      <circle cx="0" cy="0" r="4" fill="#10B981" className="animate-[pulse_1.5s_infinite]">
                        <animateMotion
                          path={`M 250,225 L ${250 + ((selectedResource.lat - userCoords.lat) * 8000)},${225 - ((selectedResource.lng - userCoords.lng) * 8000)}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* User Location Pulse Indicator */}
                  <circle cx="250" cy="225" r="14" fill="#3B82F6" className="opacity-15 animate-ping" />
                  <circle cx="250" cy="225" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
                  <text x="250" y="245" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-700 dark:fill-slate-300">You</text>

                  {/* Resource markers */}
                  {currentCategoryResources.map(res => {
                    const markerX = 250 + ((res.lat - userCoords.lat) * 8000);
                    const markerY = 225 - ((res.lng - userCoords.lng) * 8000);
                    const isSel = selectedResource?.name === res.name;
                    
                    return (
                      <g
                        key={res.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedResource(res)}
                      >
                        {/* Pin pulse when selected */}
                        {isSel && (
                          <circle cx={markerX} cy={markerY} r="12" fill="#10B981" className="opacity-25 animate-ping" />
                        )}
                        {/* Pin icon shadow */}
                        <circle cx={markerX} cy={markerY} r="5" fill={isSel ? "#10B981" : "#EF4444"} stroke="white" strokeWidth="1.5" />
                        {/* Pin tooltip */}
                        <g className="opacity-80 hover:opacity-100 transition">
                          <rect x={markerX - 45} y={markerY - 26} width="90" height="16" rx="4" fill="#1E293B" />
                          <text x={markerX} y={markerY - 15} textAnchor="middle" fill="white" className="text-[7px] font-bold">{res.name.slice(0, 16)}...</text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating controls */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5 shadow-md">
                  <span className="text-[9px] font-extrabold text-slate-405 uppercase tracking-widest">Map Viewport</span>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                    Lat: <span className="font-mono font-bold">{userCoords.lat.toFixed(5)}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                    Lng: <span className="font-mono font-bold">{userCoords.lng.toFixed(5)}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl flex items-center gap-4 text-[10px] font-bold text-slate-600 dark:text-slate-350 shadow-md">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    <span>User</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Resources</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Route Active</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Selected Resource Detail Card */}
        {selectedResource && (
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-800 dark:text-white">{selectedResource.name}</h3>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded text-[9px] font-bold">{selectedResource.status}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">{selectedResource.address}</p>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-1.5">
                <span className="flex items-center gap-1 text-blue-600"><Compass className="h-3.5 w-3.5" /> {selectedResource.distance}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {selectedResource.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-80 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap bg-transparent"
              >
                <Phone className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="whitespace-nowrap">{showPhoneNumber ? selectedResource.phone : "Call"}</span>
              </button>
              <a
                href={
                  selectedResource.id.startsWith("live-") 
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${selectedResource.lat},${selectedResource.lng}&travelmode=driving`
                    : `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${encodeURIComponent(selectedResource.name + ", " + activeCityName)}&travelmode=driving`
                }
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
