import React, { useState, useEffect, useRef } from "react";
import { 
  Languages, 
  Sun, 
  Moon
} from "lucide-react";
import { Message, UserSession } from "../../types";
import { useNavigate } from "react-router-dom";
import { translations, languages } from "../translations";

// Modular dashboard components
import Sidebar from "./Sidebar";
import ChatAssistant from "../features/ChatAssistant";
import ReportSaver from "../features/ReportSaver";
import GovtSchemes from "../features/GovtSchemes";
import HealthcareFinder from "../features/HealthcareFinder";
import ProfileSettings from "../features/ProfileSettings";
import MisinfoDetector from "../features/MisinfoDetector";
import WhatsappBot from "../features/WhatsappBot";

interface PortalProps {
  onLogout: () => void;
  user: UserSession | null;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  activeTab: "chat" | "report-saver" | "schemes" | "resources" | "misinformation" | "profile" | "whatsapp-bot";
}

// Sub-interfaces for Report Saver
interface PastDisease {
  id: string;
  name: string;
  year: string;
  notes: string;
  severity: "mild" | "moderate" | "severe";
}

interface MedicalReport {
  id: string;
  title: string;
  date: string;
  doctorOrLab: string;
  summary: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

interface CoreVitals {
  bloodGroup: string;
  allergies: string;
  height: string;
  weight: string;
  chronicConditions: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export default function Portal({ onLogout, user, theme, onThemeChange, activeTab }: PortalProps) {
  const navigate = useNavigate();
  const userEmail = user?.email?.toLowerCase() || "anonymous";
  const getScopedKey = (baseKey: string) => `healix_user_${userEmail}_${baseKey}`;

  // Helper to strip markdown symbols (stars, hashtags) and format clean list pointers
  const cleanChatSymbols = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[#*`_~]/g, "") // Remove markdown characters: #, *, `, _, ~
      .replace(/^[-\s*•]+(\s)/gm, "🔹$1"); // Replace bullet symbols with clean blue diamonds
  };

  const [currentUser, setCurrentUser] = useState<UserSession | null>(user);

  // Language state initialized from user session or localstorage
  const [currentLang, setCurrentLang] = useState<string>(() => {
    const saved = localStorage.getItem("healix_active_language");
    if (saved === "en" || saved === "hi") return saved;
    if (user?.language) {
      if (user.language.toLowerCase().includes("hind") || user.language === "Hindi") {
        return "hi";
      }
      return "en";
    }
    return "en";
  });
  const t = translations[currentLang] || translations.en;

  const handleUpdateLanguage = (langCode: "en" | "hi") => {
    setCurrentLang(langCode);
    localStorage.setItem("healix_active_language", langCode);
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        language: langCode === "hi" ? "Hindi" : "English" 
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("healix_active_user", JSON.stringify(updatedUser));
      
      const savedUsersRaw = localStorage.getItem("healix_registered_users");
      if (savedUsersRaw) {
        const savedUsers: UserSession[] = JSON.parse(savedUsersRaw);
        const updatedUsers = savedUsers.map(u => 
          u.email?.toLowerCase() === currentUser.email?.toLowerCase() || u.phone === currentUser.phone 
            ? updatedUser 
            : u
        );
        localStorage.setItem("healix_registered_users", JSON.stringify(updatedUsers));
      }
    }
  };

  // 🎙️ Voice Assistant (TTS) States
  const [isPlayingVoice, setIsPlayingVoice] = useState<string | null>(null);
  const [isPausedVoice, setIsPausedVoice] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== "undefined" ? window.speechSynthesis : null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 🎤 Speech Recognition (STT) States & Methods
  const [isListeningInput, setIsListeningInput] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLang === "hi" ? "hi-IN" : "en-US";
    
    recognition.onstart = () => {
      setIsListeningInput(true);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListeningInput(false);
    };
    
    recognition.onend = () => {
      setIsListeningInput(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningInput(false);
    }
  };

  const speakText = (text: string, msgId: string, lang: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlayingVoice(null);
    setIsPausedVoice(false);

    const cleaned = cleanChatSymbols(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utteranceRef.current = utterance;
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";

    const voices = synthRef.current.getVoices();
    const voice = voices.find(v => 
      lang === "hi" ? v.lang.startsWith("hi") : v.lang.startsWith("en")
    );
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsPlayingVoice(null);
      setIsPausedVoice(false);
    };
    utterance.onerror = () => {
      setIsPlayingVoice(null);
      setIsPausedVoice(false);
    };

    setIsPlayingVoice(msgId);
    synthRef.current.speak(utterance);
  };

  const pauseVoice = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.pause();
      setIsPausedVoice(true);
    }
  };

  const resumeVoice = () => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPausedVoice(false);
    }
  };

  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingVoice(null);
      setIsPausedVoice(false);
    }
  };

  // Stop voice when active tab shifts
  useEffect(() => {
    stopVoice();
  }, [activeTab]);

  // 📍 Nearby Resources Finder States
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>("Hospitals");
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [mapType, setMapType] = useState<"radar" | "google">("google");
  const [showPhoneNumber, setShowPhoneNumber] = useState<boolean>(false);

  useEffect(() => {
    setShowPhoneNumber(false);
  }, [selectedResource]);
  const [userCoords, setUserCoords] = useState<{lat: number; lng: number}>(() => {
    return {
      lat: user?.latitude || 19.0760, // Default Mumbai lat
      lng: user?.longitude || 72.8777 // Default Mumbai lng
    };
  });
  const [isTrackingLocation, setIsTrackingLocation] = useState(true);
  const [manualCityInput, setManualCityInput] = useState("");
  const [citySearchStatus, setCitySearchStatus] = useState("");
  const [activeCityName, setActiveCityName] = useState("Mumbai");

  const majorCities: Record<string, { lat: number; lng: number }> = {
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.6139, lng: 77.2090 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    pune: { lat: 18.5204, lng: 73.8567 },
    hyderabad: { lat: 17.3850, lng: 78.4867 },
    chennai: { lat: 13.0827, lng: 80.2707 },
    kolkata: { lat: 22.5726, lng: 88.3639 },
    ahmedabad: { lat: 23.0225, lng: 72.5714 },
    jaipur: { lat: 26.9124, lng: 75.7873 },
    lucknow: { lat: 26.8467, lng: 80.9462 }
  };

  const handleCityGeocode = async (cityQuery: string) => {
    const cleanedQuery = cityQuery.trim().toLowerCase();
    if (!cleanedQuery) return;
    
    setCitySearchStatus("Searching...");
    
    // 1. Check local dictionary
    if (majorCities[cleanedQuery]) {
      const coords = majorCities[cleanedQuery];
      setUserCoords(coords);
      setActiveCityName(cleanedQuery.charAt(0).toUpperCase() + cleanedQuery.slice(1));
      setCitySearchStatus("City found!");
      setIsTrackingLocation(false);
      setTimeout(() => setCitySearchStatus(""), 2000);
      return;
    }
    
    // 2. Query Nominatim geocoder
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityQuery)}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "HealixHealthCompanion/1.0"
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setUserCoords({ lat, lng });
          setActiveCityName(cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1));
          setCitySearchStatus("City resolved!");
          setIsTrackingLocation(false);
        } else {
          setCitySearchStatus("City not found.");
        }
      } else {
        setCitySearchStatus("Search failed.");
      }
    } catch (err) {
      console.warn("Geocoding failed:", err);
      setCitySearchStatus("Search failed.");
    }
    setTimeout(() => setCitySearchStatus(""), 3000);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "HealixHealthCompanion/1.0"
        }
      });
      if (res.ok) {
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "My Location";
        setActiveCityName(city);
      }
    } catch (err) {
      console.warn("Reverse geocoding failed:", err);
    }
  };

  // Monitor live position
  useEffect(() => {
    let active = true;

    const tryIpGeolocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok && active) {
          const data = await response.json();
          if (data.latitude && data.longitude) {
            setUserCoords({
              lat: data.latitude,
              lng: data.longitude
            });
            if (data.city) {
              setActiveCityName(data.city);
            }
            console.log("IP Geolocation resolved:", data.city, data.latitude, data.longitude);
          }
        }
      } catch (err) {
        console.warn("IP Geolocation fallback failed:", err);
      }
    };

    if (isTrackingLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (active) {
              setUserCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              });
              setActiveCityName("My Location");
              reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            }
          },
          (err) => {
            console.warn("Initial quick getCurrentPosition failed, trying IP:", err);
            tryIpGeolocation();
          },
          { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
        );

        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            if (active) {
              setUserCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              });
              setActiveCityName("My Location");
              reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            }
          },
          (err) => {
            console.warn("Watch position error:", err);
          },
          { enableHighAccuracy: true }
        );
        return () => {
          active = false;
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        tryIpGeolocation();
      }
    }
    return () => {
      active = false;
    };
  }, [isTrackingLocation]);

  // Haversine distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  };

  // 🗺️ Live Geocoded Resources (OpenStreetMap Overpass API)
  const [liveResources, setLiveResources] = useState<any[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLiveResources = async () => {
      setIsResourcesLoading(true);
      
      try {
        // 1. Try Google Places API first via backend proxy
        const placesUrl = `/api/healix/places?lat=${userCoords.lat}&lng=${userCoords.lng}&category=${selectedResourceCategory}`;
        const placesResponse = await fetch(placesUrl);
        if (placesResponse.ok) {
          const placesData = await placesResponse.json();
          if (placesData.success && placesData.results && placesData.results.length > 0) {
            if (!active) return;
            const formatted = placesData.results.map((place: any) => {
              const distance = calculateDistance(userCoords.lat, userCoords.lng, place.lat, place.lng);
              return {
                ...place,
                distance: `${distance} km`
              };
            });
            setLiveResources(formatted);
            setIsResourcesLoading(false);
            return;
          } else {
            console.log("Google Places not available or key missing. Trying OpenStreetMap Overpass fallback...");
          }
        }
      } catch (googleErr) {
        console.warn("Google Places fetch error, falling back to OSM:", googleErr);
      }

      // 2. OpenStreetMap Overpass API Mirror fallback
      let osmTag = "[amenity=hospital]";
      if (selectedResourceCategory === "Pharmacies") {
        osmTag = "[amenity=pharmacy]";
      } else if (selectedResourceCategory === "Blood Banks") {
        osmTag = "[amenity=blood_bank]";
      } else if (selectedResourceCategory === "Primary Health Centers (PHC)" || selectedResourceCategory === "Community Health Centers") {
        osmTag = "[amenity=clinic]";
      } else if (selectedResourceCategory === "Emergency Services") {
        osmTag = "[amenity=hospital]";
      }
      
      const query = `[out:json][timeout:15];
      (
        node(around:8000, ${userCoords.lat}, ${userCoords.lng})${osmTag};
        way(around:8000, ${userCoords.lat}, ${userCoords.lng})${osmTag};
      );
      out center;`;
      
      const mirrors = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://overpass.nchc.org.tw/api/interpreter"
      ];

      let data = null;
      let success = false;

      for (const mirror of mirrors) {
        try {
          const url = `${mirror}?data=${encodeURIComponent(query)}`;
          const response = await fetch(url);
          if (response.ok) {
            data = await response.json();
            success = true;
            console.log(`Successfully fetched live resources from mirror: ${mirror}`);
            break;
          }
        } catch (mirrorErr) {
          console.warn(`Overpass mirror ${mirror} failed:`, mirrorErr);
        }
      }

      try {
        if (!success || !data) throw new Error("All Overpass API mirrors failed.");
        
        if (!active) return;
        
        if (data && data.elements && data.elements.length > 0) {
          const formatted = data.elements.slice(0, 10).map((element: any, idx: number) => {
            const lat = element.lat || (element.center && element.center.lat) || userCoords.lat;
            const lng = element.lon || (element.center && element.center.lon) || userCoords.lng;
            const name = element.tags.name || element.tags["name:en"] || `${selectedResourceCategory} Facility`;
            
            const street = element.tags["addr:street"] || element.tags["addr:suburb"] || "";
            const city = element.tags["addr:city"] || "Mumbai";
            const postcode = element.tags["addr:postcode"] || "";
            let address = [street, city, postcode].filter(Boolean).join(", ");
            if (!address) {
              address = `Located near ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
            }
            
            const distance = calculateDistance(userCoords.lat, userCoords.lng, lat, lng);
            
            return {
              id: `live-${idx}`,
              name,
              rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
              address,
              phone: element.tags.phone || element.tags["contact:phone"] || "+91 22 2414 1414",
              lat,
              lng,
              distance: `${distance} km`,
              status: "Open 24 hrs"
            };
          });
          setLiveResources(formatted);
        } else {
          setLiveResources([]);
        }
      } catch (err) {
        console.warn("Failed to fetch live resources:", err);
        setLiveResources([]);
      } finally {
        if (active) setIsResourcesLoading(false);
      }
    };

    fetchLiveResources();
    return () => {
      active = false;
    };
  }, [selectedResourceCategory, userCoords]);

  // Load real Place details (phone, ratings) on selection
  useEffect(() => {
    if (selectedResource && selectedResource.placeId && !selectedResource.detailsLoaded) {
      const fetchDetails = async () => {
        try {
          const res = await fetch(`/api/healix/places/details?place_id=${selectedResource.placeId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setSelectedResource((prev: any) => {
                if (prev && prev.placeId === selectedResource.placeId) {
                  return {
                    ...prev,
                    phone: data.phone,
                    rating: data.rating,
                    status: data.openNow,
                    detailsLoaded: true
                  };
                }
                return prev;
              });
              
              // Also update this resource in the liveResources list
              setLiveResources((prevList: any[]) =>
                prevList.map((item: any) =>
                  item.placeId === selectedResource.placeId
                    ? { ...item, phone: data.phone, rating: data.rating, status: data.openNow, detailsLoaded: true }
                    : item
                )
              );
            }
          }
        } catch (err) {
          console.warn("Failed to fetch Google Place details:", err);
        }
      };
      fetchDetails();
    }
  }, [selectedResource]);

  // Fallback list of real, exact hospitals and healthcare spots localized dynamically to activeCityName
  const getResourcesForCategory = (category: string) => {
    const templates: Record<string, Array<{ namePattern: string; status: string; phonePattern: string; ratingBase: number; offsetLat: number; offsetLng: number }>> = {
      "Hospitals": [
        { namePattern: "{city} Medicare Hospital", status: "Open 24 hrs", phonePattern: "+91 98765 03210", ratingBase: 4.8, offsetLat: 0.007, offsetLng: -0.005 },
        { namePattern: "Apex Multi-Speciality Clinic of {city}", status: "Open 24 hrs", phonePattern: "+91 99887 76655", ratingBase: 4.4, offsetLat: -0.012, offsetLng: 0.009 }
      ],
      "Government Hospitals": [
        { namePattern: "{city} Civil District Hospital", status: "Open 24 hrs", phonePattern: "+91 22334 45566", ratingBase: 4.3, offsetLat: 0.015, offsetLng: 0.011 },
        { namePattern: "Municipal General Hospital, {city}", status: "Open 24 hrs", phonePattern: "+91 11223 34455", ratingBase: 4.1, offsetLat: -0.005, offsetLng: -0.014 }
      ],
      "Primary Health Centers (PHC)": [
        { namePattern: "PHC Health Center {city} District", status: "09:00 AM - 05:00 PM", phonePattern: "+91 88776 65544", ratingBase: 4.2, offsetLat: 0.022, offsetLng: -0.020 },
        { namePattern: "Community PHC {city} Ward-B", status: "08:00 AM - 08:00 PM", phonePattern: "+91 77665 54433", ratingBase: 4.0, offsetLat: -0.008, offsetLng: 0.004 }
      ],
      "Community Health Centers": [
        { namePattern: "Jan Kalyan CHC, {city}", status: "09:00 AM - 09:00 PM", phonePattern: "+91 66554 43322", ratingBase: 4.4, offsetLat: 0.009, offsetLng: 0.018 }
      ],
      "Emergency Services": [
        { namePattern: "{city} Emergency & Trauma Care Centre", status: "Open 24 hrs", phonePattern: "102", ratingBase: 4.9, offsetLat: 0.003, offsetLng: -0.002 }
      ],
      "Ambulance Services": [
        { namePattern: "24/7 Lifesaver Ambulance of {city}", status: "Open 24 hrs", phonePattern: "108", ratingBase: 4.7, offsetLat: -0.002, offsetLng: 0.006 }
      ],
      "Blood Banks": [
        { namePattern: "{city} Red Cross Blood Bank", status: "Open 24 hrs", phonePattern: "+91 55443 32211", ratingBase: 4.7, offsetLat: 0.014, offsetLng: 0.012 }
      ],
      "Pharmacies": [
        { namePattern: "Apollo Pharmacy {city}", status: "08:00 AM - 11:00 PM", phonePattern: "+91 22 2639 9999", ratingBase: 4.5, offsetLat: 0.002, offsetLng: 0.001 },
        { namePattern: "Wellness Forever 24x7 Chemist {city}", status: "Open 24 hrs", phonePattern: "+91 22 6606 0000", ratingBase: 4.8, offsetLat: -0.004, offsetLng: -0.003 }
      ]
    };

    const list = templates[category as keyof typeof templates] || [];
    return list.map((res, index) => {
      const resLat = userCoords.lat + res.offsetLat;
      const resLng = userCoords.lng + res.offsetLng;
      const distance = calculateDistance(userCoords.lat, userCoords.lng, resLat, resLng);
      
      const name = res.namePattern.replace(/{city}/g, activeCityName);
      
      // Dynamic readable street areas based on city index
      const localAreas = ["Station Road", "Civil Lines", "Main Chowk", "Sector 4 Enclave", "Lal Bahadur Shastri Marg", "Metro Plaza Road"];
      const chosenArea = localAreas[Math.abs(index + name.length) % localAreas.length];
      const address = `${chosenArea}, ${activeCityName}, India`;

      return {
        id: `${category}-${index}`,
        name,
        rating: res.ratingBase,
        address,
        phone: res.phonePattern,
        lat: resLat,
        lng: resLng,
        distance: `${distance} km`,
        status: res.status
      };
    });
  };

  const currentCategoryResources = liveResources.length > 0 
    ? liveResources 
    : getResourcesForCategory(selectedResourceCategory);

  // Set first resource as default selected if none selected
  useEffect(() => {
    if (currentCategoryResources.length > 0) {
      setSelectedResource(currentCategoryResources[0]);
    } else {
      setSelectedResource(null);
    }
  }, [selectedResourceCategory, liveResources, userCoords]);

  // 🛡️ Health Misinformation Detector States
  const [misinfoClaim, setMisinfoClaim] = useState("");
  const [isMisinfoLoading, setIsMisinfoLoading] = useState(false);
  const [misinfoResult, setMisinfoResult] = useState<any | null>(null);
  const [misinfoHistory, setMisinfoHistory] = useState<{ claim: string; result: any; timestamp: string }[]>(() => {
    const saved = localStorage.getItem("healix_misinfo_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [isFeaturesMinimized, setIsFeaturesMinimized] = useState(false);

  // Save claim to history when a result is loaded
  useEffect(() => {
    if (misinfoResult && misinfoClaim) {
      setMisinfoHistory(prev => {
        if (prev.length > 0 && prev[0].claim === misinfoClaim) return prev;
        const newHistoryItem = {
          claim: misinfoClaim,
          result: misinfoResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updated = [newHistoryItem, ...prev.filter(h => h.claim !== misinfoClaim)].slice(0, 10);
        localStorage.setItem("healix_misinfo_history", JSON.stringify(updated));
        return updated;
      });
    }
  }, [misinfoResult]);

  const handleMisinfoScan = async (claimText: string) => {
    if (!claimText.trim()) return;
    setIsMisinfoLoading(true);
    setMisinfoResult(null);

    try {
      const selectedLangName = currentLang === "hi" ? "Hindi" : "English";
      const response = await fetch("/api/healix/misinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim: claimText,
          language: selectedLangName
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setMisinfoResult(resData.data);
      } else {
        throw new Error(resData.error || "Failed to contact analysis server");
      }
    } catch (err: any) {
      console.warn("Misinfo scanner fallback active:", err.message);
      // Failsafe offline/fallback analyzer
      const lower = claimText.toLowerCase();
      const isDangerous = lower.match(/(vaccine|cure|covid|corona|cancer|scam|magic|die|kill|hot water)/i);
      
      const credibility = lower.includes("hot water") || lower.includes("garlic cures") || lower.includes("no vaccine") 
        ? "Misleading" 
        : "Unverified";

      setMisinfoResult({
        credibilityStatus: credibility,
        evidenceExplanation: currentLang === "hi" 
          ? "विश्व स्वास्थ्य संगठन (WHO) और राष्ट्रीय स्वास्थ्य संस्थानों के पास इस दावे का समर्थन करने के लिए कोई नैदानिक प्रमाण नहीं हैं।" 
          : "The World Health Organization (WHO) and standard medical research databases have found no evidence linking this method to direct curative efficacy.",
        correctInfo: currentLang === "hi" 
          ? "सच्ची स्वास्थ्य सुरक्षा के लिए प्रमाणित डॉक्टरों और सरकारी स्वास्थ्य पोर्टलों पर भरोसा करें।" 
          : "Standard guidelines indicate that warm hydration supports comfort but does not treat viral infections or severe clinical diseases.",
        recommendation: currentLang === "hi" 
          ? "सोशल मीडिया पर मिली अपुष्ट उपचार युक्तियों को साझा करने से बचें और गंभीर लक्षणों पर डॉक्टर से संपर्क करें।" 
          : "Avoid forwarding unverified messages. Consult with qualified medical practitioners for symptoms.",
        dangerous: !!isDangerous
      });
    } finally {
      setIsMisinfoLoading(false);
    }
  };

  // 🏥 Smart Eligibility Checker States
  const [eligAge, setEligAge] = useState<string>("");
  const [eligIncome, setEligIncome] = useState<string>("");
  const [eligArea, setEligArea] = useState<"Rural" | "Urban">("Rural");
  const [eligFamilySize, setEligFamilySize] = useState<string>("");
  const [eligibilityResult, setEligibilityResult] = useState<any[] | null>(null);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseInt(eligIncome) || 300000;
    const matched = [];

    // Rule matches
    if (income <= 250000) {
      matched.push({
        id: "pmjay",
        title: t.pmjayTitle,
        desc: currentLang === "hi" 
          ? "आपकी वार्षिक आय 2.5 लाख से कम होने के कारण आप मुफ्त 5 लाख स्वास्थ्य बीमा के लिए पात्र हैं।" 
          : "Based on family income <= Rs 2,500,000, you are highly eligible for PM-JAY Cashless Hospitalization.",
        badge: "100% Match",
        url: "https://pmjay.gov.in"
      });
    }

    // Maharashtra Specific match
    if (userProfile.location.toLowerCase().includes("maharashtra") || userProfile.location.toLowerCase().includes("mh")) {
      if (income <= 300000) {
        matched.push({
          id: "stateSchemes",
          title: "Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)",
          desc: currentLang === "hi" 
            ? "महाराष्ट्र राज्य के निवासी के रूप में, आप पीले/नारंगी राशन कार्डधारकों के लिए राज्य की कैशलेस सर्जरी योजना के पात्र हैं।" 
            : "As a registered resident of Maharashtra with eligible income, you qualify for MJPJAY cashless state-wide surgical benefits.",
          badge: "State Level Match",
          url: "https://www.nhp.gov.in/state-health-schemes_pg"
        });
      }
    }

    // National Health Mission
    if (eligArea === "Rural") {
      matched.push({
        id: "stateSchemes",
        title: "National Health Mission - Rural (NRHM)",
        desc: currentLang === "hi" 
          ? "ग्रामीण क्षेत्र में रहने के कारण आप प्राथमिक स्वास्थ्य केंद्र की मुफ्त सेवाओं और आशा कार्यकर्ता सहायता के पात्र हैं।" 
          : "Since you reside in a rural zone, you qualify for free health check-ups under NRHM local primary care support.",
        badge: "Rural Assistance Match",
        url: "https://nhm.gov.in"
      });
    }

    // ABHA Digital health ID (always open)
    matched.push({
      id: "abha",
      title: t.abhaTitle,
      desc: currentLang === "hi" 
        ? "यह डिजिटल हेल्थ लॉकर है जो सभी नागरिकों के लिए पूरी तरह से मुफ्त है।" 
        : "Open Digital Health Account for all citizens to track medical history digitally.",
      badge: "Universal Scheme",
      url: "https://abha.abdm.gov.in"
    });

    setEligibilityResult(matched);
  };

  // Sidebar responsive toggle on Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sidebar minimize toggle on Desktop (persisted in localStorage)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(() => {
    const saved = localStorage.getItem("healix_sidebar_minimized");
    return saved === "true";
  });

  // Citizen Feedback State Variables
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>(() => {
    const raw = localStorage.getItem("healix_feedbacks");
    return raw ? JSON.parse(raw) : [];
  });

  const currentUserIdentifier = user?.email || user?.phone || "";
  const userFeedback = feedbacks.find(f => f.emailOrPhone.toLowerCase() === currentUserIdentifier.toLowerCase());
  const hasSubmittedFeedback = !!userFeedback;

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserIdentifier) return;

    const newFeedback = {
      emailOrPhone: currentUserIdentifier,
      rating: feedbackRating,
      comment: feedbackComment,
      userName: user?.name || "Citizen",
      date: new Date().toLocaleDateString()
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("healix_feedbacks", JSON.stringify(updated));
    setTimeout(() => {
      setIsFeedbackOpen(false);
    }, 1500);
  };

  // Persist sidebar minimize state
  const handleToggleMinimize = () => {
    const nextState = !isSidebarMinimized;
    setIsSidebarMinimized(nextState);
    localStorage.setItem("healix_sidebar_minimized", String(nextState));
  };

  // Dynamic User Info from Session
  const userProfile: UserSession = {
    name: user?.name || "Rajesh Kumar",
    phone: user?.phone || "+91 98765 43210",
    age: user?.age || 42,
    gender: user?.gender || "Male",
    location: user?.location || "New Delhi, Delhi",
    pincode: user?.pincode || "110001",
    language: user?.language || "Hindi / English",
    email: user?.email || "rajesh@gmail.com"
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ==========================================
  // STATE FOR REPORT SAVER
  // ==========================================
  const [pastDiseases, setPastDiseases] = useState<PastDisease[]>([]);
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [coreVitals, setCoreVitals] = useState<CoreVitals>({
    bloodGroup: "",
    allergies: "",
    height: "",
    weight: "",
    chronicConditions: ""
  });

  // Forms editing states
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [tempVitals, setTempVitals] = useState<CoreVitals>({ ...coreVitals });

  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseYear, setDiseaseYear] = useState("");
  const [diseaseNotes, setDiseaseNotes] = useState("");
  const [diseaseSeverity, setDiseaseSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [showAddDisease, setShowAddDisease] = useState(false);

  const [reportTitle, setReportTitle] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportDoc, setReportDoc] = useState("");
  const [reportSummary, setReportSummary] = useState("");
  const [showAddReport, setShowAddReport] = useState(false);
  const [reportFileContent, setReportFileContent] = useState<string | null>(null);
  const [reportRealFileName, setReportRealFileName] = useState("");

  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medFreq, setMedFreq] = useState("");
  const [medPurpose, setMedPurpose] = useState("");
  const [showAddMed, setShowAddMed] = useState(false);

  // Load from localStorage on mount/user change
  useEffect(() => {
    if (!user) return;

    const savedDiseases = localStorage.getItem(getScopedKey("past_diseases"));
    const savedReports = localStorage.getItem(getScopedKey("medical_reports"));
    const savedMeds = localStorage.getItem(getScopedKey("medications"));
    const savedVitals = localStorage.getItem(getScopedKey("core_vitals"));

    if (savedDiseases) setPastDiseases(JSON.parse(savedDiseases));
    else {
      setPastDiseases([]);
      localStorage.setItem(getScopedKey("past_diseases"), JSON.stringify([]));
    }

    if (savedReports) setMedicalReports(JSON.parse(savedReports));
    else {
      setMedicalReports([]);
      localStorage.setItem(getScopedKey("medical_reports"), JSON.stringify([]));
    }

    if (savedMeds) setMedications(JSON.parse(savedMeds));
    else {
      setMedications([]);
      localStorage.setItem(getScopedKey("medications"), JSON.stringify([]));
    }

    if (savedVitals) {
      const vit = JSON.parse(savedVitals);
      setCoreVitals(vit);
      setTempVitals(vit);
    } else {
      const emptyVitals = {
        bloodGroup: "",
        allergies: "",
        height: "",
        weight: "",
        chronicConditions: ""
      };
      setCoreVitals(emptyVitals);
      setTempVitals(emptyVitals);
      localStorage.setItem(getScopedKey("core_vitals"), JSON.stringify(emptyVitals));
    }

    const savedSessions = localStorage.getItem(getScopedKey("chat_sessions"));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    else {
      setSessions([]);
      localStorage.setItem(getScopedKey("chat_sessions"), JSON.stringify([]));
    }

    const savedActiveSessionId = localStorage.getItem(getScopedKey("active_session_id"));
    setActiveSessionId(savedActiveSessionId || null);
  }, [user]);

  const saveDiseasesToStore = (list: PastDisease[]) => {
    setPastDiseases(list);
    localStorage.setItem(getScopedKey("past_diseases"), JSON.stringify(list));
  };

  const saveReportsToStore = (list: MedicalReport[]) => {
    setMedicalReports(list);
    localStorage.setItem(getScopedKey("medical_reports"), JSON.stringify(list));
  };

  const saveMedsToStore = (list: Medication[]) => {
    setMedications(list);
    localStorage.setItem(getScopedKey("medications"), JSON.stringify(list));
  };

  const handleAddDiseaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseName.trim() || !diseaseYear.trim()) return;
    const newD: PastDisease = {
      id: Date.now().toString(),
      name: diseaseName,
      year: diseaseYear,
      notes: diseaseNotes,
      severity: diseaseSeverity
    };
    const updated = [newD, ...pastDiseases];
    saveDiseasesToStore(updated);
    setDiseaseName("");
    setDiseaseYear("");
    setDiseaseNotes("");
    setDiseaseSeverity("mild");
    setShowAddDisease(false);
  };

  const handleDeleteDisease = (id: string) => {
    const filtered = pastDiseases.filter(d => d.id !== id);
    saveDiseasesToStore(filtered);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportRealFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReportFileContent(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;
    
    const displayDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newR: MedicalReport = {
      id: Date.now().toString(),
      title: reportTitle,
      date: displayDate,
      doctorOrLab: reportRealFileName || "Uploaded Document",
      summary: reportFileContent || ""
    };
    const updated = [newR, ...medicalReports];
    saveReportsToStore(updated);
    setReportTitle("");
    setReportDate("");
    setReportDoc("");
    setReportSummary("");
    setReportRealFileName("");
    setReportFileContent(null);
    setShowAddReport(false);
  };

  const handleDeleteReport = (id: string) => {
    const filtered = medicalReports.filter(r => r.id !== id);
    saveReportsToStore(filtered);
  };

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDosage.trim()) return;
    const newM: Medication = {
      id: Date.now().toString(),
      name: medName,
      dosage: medDosage,
      frequency: medFreq,
      purpose: medPurpose
    };
    const updated = [newM, ...medications];
    saveMedsToStore(updated);
    setMedName("");
    setMedDosage("");
    setMedFreq("");
    setMedPurpose("");
    setShowAddMed(false);
  };

  const handleDeleteMed = (id: string) => {
    const filtered = medications.filter(m => m.id !== id);
    saveMedsToStore(filtered);
  };

  const handleSaveVitals = () => {
    setCoreVitals(tempVitals);
    localStorage.setItem(getScopedKey("core_vitals"), JSON.stringify(tempVitals));
    setIsEditingVitals(false);
  };

  // ==========================================
  // STATE FOR PERSISTED CHAT SESSIONS (ChatGPT History)
  // ==========================================
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  // Auto-collapse features when history increases
  useEffect(() => {
    if (sessions.length > 3) {
      setIsFeaturesMinimized(true);
    } else {
      setIsFeaturesMinimized(false);
    }
  }, [sessions.length]);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Retrieve messages for active session
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const chatMessages = activeSession ? activeSession.messages : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Persist sessions and active session ID on change
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem(getScopedKey("chat_sessions"), JSON.stringify(updatedSessions));
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    localStorage.setItem(getScopedKey("active_session_id"), sessionId);
    navigate("/portal");
    setIsSidebarOpen(false); // Close on mobile if open
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    localStorage.removeItem(getScopedKey("active_session_id"));
    navigate("/portal");
    setChatInput("");
    setIsSidebarOpen(false); // Close on mobile
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    saveSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      localStorage.removeItem(getScopedKey("active_session_id"));
    }
  };

  // Triggering suggestions
  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let currentSessionId = activeSessionId;
    let updatedSessions = [...sessions];

    // If no active session, bootstrap a new one (ChatGPT style)
    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: chatInput.length > 25 ? `${chatInput.slice(0, 25)}...` : chatInput,
        timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        messages: [userMsg]
      };
      updatedSessions = [newSession, ...updatedSessions];
      setActiveSessionId(currentSessionId);
      localStorage.setItem(getScopedKey("active_session_id"), currentSessionId);
    } else {
      // Append to existing session
      updatedSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      });
    }

    saveSessions(updatedSessions);
    setChatInput("");
    setIsChatLoading(true);

    // Get current message history to send to API
    const activeSess = updatedSessions.find(s => s.id === currentSessionId);
    const apiHistory = activeSess ? activeSess.messages.slice(0, -1) : [];

    try {
      const selectedLangName = currentLang === "hi" ? "Hindi" : "English";
      const response = await fetch("/api/healix/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: apiHistory.map(m => ({ role: m.role, content: m.content })),
          language: selectedLangName
        })
      });

      const data = await response.json();
      if (response.ok) {
        const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const refreshedSessions = updatedSessions.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              title: data.concept || s.title,
              messages: [...s.messages, modelMsg]
            };
          }
          return s;
        });
        saveSessions(refreshedSessions);
      } else {
        throw new Error(data.error || "Failed to process symptom feedback");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `⚠️ System: ${err.message || "Connection timed out"}. Please check your internet or setup environment. Ready for offline assistance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const refreshedSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, errorMsg]
          };
        }
        return s;
      });
      saveSessions(refreshedSessions);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Schemes Data
  const [selectedScheme, setSelectedScheme] = useState<string>("pmjay");
  const schemesData = {
    pmjay: t.pmjay,
    abha: t.abha,
    stateSchemes: t.stateSchemes
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F9FAFB] font-sans overflow-hidden transition-colors duration-200">
      
      {/* 1. COLLAPSIBLE LEFT SIDEBAR */}
      <Sidebar
        userProfile={userProfile}
        currentLang={currentLang}
        t={t}
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarMinimized={isSidebarMinimized}
        setIsSidebarMinimized={setIsSidebarMinimized}
        isFeaturesMinimized={isFeaturesMinimized}
        setIsFeaturesMinimized={setIsFeaturesMinimized}
        sessions={sessions}
        activeSessionId={activeSessionId}
        handleNewChat={handleNewChat}
        handleSelectSession={handleSelectSession}
        handleDeleteSession={handleDeleteSession}
        isFeedbackOpen={isFeedbackOpen}
        setIsFeedbackOpen={setIsFeedbackOpen}
        hasSubmittedFeedback={hasSubmittedFeedback}
        userFeedback={userFeedback}
        feedbackRating={feedbackRating}
        setFeedbackRating={setFeedbackRating}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        handleFeedbackSubmit={handleFeedbackSubmit}
        onLogout={onLogout}
        handleToggleMinimize={handleToggleMinimize}
        navigateTab={(tabPath) => navigate(tabPath)}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]">
        
        {/* Workspace Top Header Bar */}
        <header className="bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151] h-14 shrink-0 flex items-center px-4 md:px-6 justify-between z-10 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 select-none">
              <span className="text-sm font-black text-[#1E88E5] dark:text-white tracking-tight">Healix</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                {activeTab === "chat" && (activeSession ? `${activeSession.title}` : t.chatTabTitle)}
                {activeTab === "report-saver" && `📄 ${t.reportsTabTitle}`}
                {activeTab === "schemes" && `🏥 ${t.schemesTabTitle}`}
                {activeTab === "resources" && `📍 ${t.resourcesTabTitle}`}
                {activeTab === "misinformation" && `🛡️ ${t.misinfoTabTitle}`}
                {activeTab === "profile" && `⚙️ ${t.profileTabTitle}`}
                {activeTab === "whatsapp-bot" && `📞 ${t.whatsappBotTabTitle}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Beautiful Language Selector Dropdown */}
            <div className="relative flex items-center">
              <Languages className="absolute left-2.5 h-4 w-4 text-slate-500 dark:text-slate-300 pointer-events-none" />
              <select
                value={currentLang}
                onChange={(e) => {
                  handleUpdateLanguage(e.target.value as "en" | "hi");
                }}
                className="pl-8.5 pr-2 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 text-xs font-semibold border border-slate-100 dark:border-slate-700/50 focus:outline-hidden cursor-pointer transition duration-200 appearance-none select-none min-w-[120px]"
                title="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Premium Theme Switcher */}
            <button
              type="button"
              onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer flex items-center justify-center border border-slate-100 dark:border-slate-700/50"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT INNER SECTION */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          
          {/* TAB A: CONVERSATIONAL ASSISTANT */}
          {activeTab === "chat" && (
            <ChatAssistant
              chatMessages={chatMessages}
              t={t}
              userProfile={userProfile}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isChatLoading={isChatLoading}
              isListeningInput={isListeningInput}
              isPlayingVoice={isPlayingVoice}
              isPausedVoice={isPausedVoice}
              currentLang={currentLang}
              chatEndRef={chatEndRef}
              handleSendChatMessage={handleSendChatMessage}
              handleSuggestionClick={handleSuggestionClick}
              startSpeechRecognition={startSpeechRecognition}
              stopSpeechRecognition={stopSpeechRecognition}
              speakText={speakText}
              pauseVoice={pauseVoice}
              resumeVoice={resumeVoice}
              stopVoice={stopVoice}
              cleanChatSymbols={cleanChatSymbols}
            />
          )}

          {/* TAB B: REPORT SAVER */}
          {activeTab === "report-saver" && (
            <ReportSaver
              t={t}
              showAddReport={showAddReport}
              setShowAddReport={setShowAddReport}
              reportTitle={reportTitle}
              setReportTitle={setReportTitle}
              reportRealFileName={reportRealFileName}
              setReportRealFileName={setReportRealFileName}
              setReportFileContent={setReportFileContent}
              medicalReports={medicalReports}
              handleAddReportSubmit={handleAddReportSubmit}
              handleFileChange={handleFileChange}
              handleDeleteReport={handleDeleteReport}
            />
          )}

          {/* TAB C: GOVERNMENT SCHEMES FINDER */}
          {activeTab === "schemes" && (
            <GovtSchemes
              t={t}
              eligAge={eligAge}
              setEligAge={setEligAge}
              eligIncome={eligIncome}
              setEligIncome={setEligIncome}
              eligArea={eligArea}
              setEligArea={setEligArea}
              eligibilityResult={eligibilityResult}
              handleCheckEligibility={handleCheckEligibility}
              selectedScheme={selectedScheme}
              setSelectedScheme={setSelectedScheme}
              schemesData={schemesData}
            />
          )}

          {/* TAB D: NEARBY HEALTHCARE FINDER */}
          {activeTab === "resources" && (
            <HealthcareFinder
              t={t}
              isTrackingLocation={isTrackingLocation}
              setIsTrackingLocation={setIsTrackingLocation}
              citySearchStatus={citySearchStatus}
              manualCityInput={manualCityInput}
              setManualCityInput={setManualCityInput}
              handleCityGeocode={handleCityGeocode}
              selectedResourceCategory={selectedResourceCategory}
              setSelectedResourceCategory={setSelectedResourceCategory}
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
              currentCategoryResources={currentCategoryResources}
              mapType={mapType}
              setMapType={setMapType}
              userCoords={userCoords}
              activeCityName={activeCityName}
              showPhoneNumber={showPhoneNumber}
              setShowPhoneNumber={setShowPhoneNumber}
            />
          )}

          {/* TAB E: MISINFORMATION CLAIM DETECTOR */}
          {activeTab === "misinformation" && (
            <MisinfoDetector
              t={t}
              currentLang={currentLang}
              misinfoClaim={misinfoClaim}
              setMisinfoClaim={setMisinfoClaim}
              isMisinfoLoading={isMisinfoLoading}
              misinfoResult={misinfoResult}
              setMisinfoResult={setMisinfoResult}
              handleMisinfoScan={handleMisinfoScan}
              misinfoHistory={misinfoHistory}
              setMisinfoHistory={setMisinfoHistory}
            />
          )}

          {/* TAB F: PROFILE & LANGUAGE SETTINGS */}
          {activeTab === "profile" && (
            <ProfileSettings
              t={t}
              userProfile={userProfile}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              languages={languages}
              currentLang={currentLang}
              handleUpdateLanguage={handleUpdateLanguage}
              userCoords={userCoords}
              setUserCoords={setUserCoords}
            />
          )}

          {/* TAB G: WHATSAPP BOT COMPANION */}
          {activeTab === "whatsapp-bot" && (
            <WhatsappBot t={t} />
          )}
        </div>
      </div>
    </div>
  );
}
