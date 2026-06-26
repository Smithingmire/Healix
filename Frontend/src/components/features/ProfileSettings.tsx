import React from "react";
import { User, Languages } from "lucide-react";
import { UserSession } from "../../types";
import { TranslationSet } from "../translations";

interface ProfileSettingsProps {
  t: TranslationSet;
  userProfile: UserSession;
  currentUser: UserSession | null;
  setCurrentUser: (u: UserSession | null) => void;
  languages: { code: string; name: string }[];
  currentLang: string;
  handleUpdateLanguage: (lang: "en" | "hi") => void;
  userCoords: { lat: number; lng: number };
  setUserCoords: (coords: { lat: number; lng: number }) => void;
}

export default function ProfileSettings({
  t,
  userProfile,
  currentUser,
  setCurrentUser,
  languages,
  currentLang,
  handleUpdateLanguage,
  userCoords,
  setUserCoords
}: ProfileSettingsProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in h-full bg-slate-55/40 dark:bg-[#0B0F19]">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h3 className="font-extrabold text-xl text-[#0F172A] dark:text-white flex items-center gap-2">
            <User className="h-5.5 w-5.5 text-blue-600" />
            <span>{t.profileSettings}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage user preferences, geographic credentials, and active languages.</p>
        </div>

        {/* Profile card details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
              {getInitials(userProfile.name)}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-base">{userProfile.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{userProfile.email || "Registered Citizen"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Language select field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.selectLanguage}</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleUpdateLanguage(lang.code as "en" | "hi")}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border-none ${
                      currentLang === lang.code
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-655 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850"
                    }`}
                  >
                    <Languages className="h-4 w-4" />
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Geolocation Coordinate display */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Capture Location Coordinates</label>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex justify-between items-center">
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  <div>Lat: <span className="font-bold">{userCoords.lat.toFixed(5)}</span></div>
                  <div>Lng: <span className="font-bold">{userCoords.lng.toFixed(5)}</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const updatedCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                          setUserCoords(updatedCoords);
                          
                          // Update active user in local storage
                          if (currentUser) {
                            const updatedUser = { 
                              ...currentUser, 
                              latitude: pos.coords.latitude, 
                              longitude: pos.coords.longitude 
                            };
                            setCurrentUser(updatedUser);
                            localStorage.setItem("healix_active_user", JSON.stringify(updatedUser));
                          }
                        },
                        (err) => console.error(err)
                      );
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-bold cursor-pointer transition"
                >
                  Refresh GPS
                </button>
              </div>
            </div>
          </div>

          {/* Metadata display */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400">Pincode / Zone</span>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{userProfile.pincode}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400">Registered City</span>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{userProfile.location}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
