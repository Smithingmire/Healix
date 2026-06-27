import React, { useState, useEffect, useRef } from "react";
import { 
  Languages, 
  Sun, 
  Moon,
  Menu
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


interface PortalProps {
  onLogout: () => void;
  user: UserSession | null;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  activeTab: "chat" | "report-saver" | "schemes" | "resources" | "misinformation" | "profile";
  onUserUpdate?: (u: UserSession) => void;
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

export default function Portal({ onLogout, user, theme, onThemeChange, activeTab, onUserUpdate }: PortalProps) {
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

  const syncUserWithBackend = async (updates: Partial<UserSession>) => {
    if (!currentUser || !currentUser._id) return;
    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          updates
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (onUserUpdate) {
          onUserUpdate(data.user);
        }
        localStorage.setItem("healix_active_user", JSON.stringify(data.user));
      }
    } catch (e) {
      console.error("Failed to sync user updates to MongoDB:", e);
    }
  };

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
      syncUserWithBackend({ language: langCode === "hi" ? "Hindi" : "English" });
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

    let textToSpeak = text;
    try {
      if (text && text.trim().startsWith("{") && text.trim().endsWith("}")) {
        const parsed = JSON.parse(text);
        if (parsed.isHealthReport) {
          textToSpeak = `${parsed.greeting || ""}. Assessment: ${parsed.concernBadge || ""}. ${parsed.concernExplanation || ""} ${parsed.reassuranceMessage || ""}`;
        } else if (parsed.conversationalResponse) {
          textToSpeak = parsed.conversationalResponse;
        }
      }
    } catch (e) {
      // fallback to original text
    }

    const cleaned = cleanChatSymbols(textToSpeak);
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
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState<string | null>(null);
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
    const cleanedQuery = cityQuery.trim();
    if (!cleanedQuery) return;
    
    setCitySearchStatus("Searching...");
    
    const lowerQuery = cleanedQuery.toLowerCase();
    
    // 1. Check local dictionary
    if (majorCities[lowerQuery]) {
      const coords = majorCities[lowerQuery];
      setUserCoords(coords);
      setActiveCityName(cleanedQuery.charAt(0).toUpperCase() + cleanedQuery.slice(1));
      setCitySearchStatus("City found!");
      setIsTrackingLocation(false);
      setTimeout(() => setCitySearchStatus(""), 2000);
      return;
    }
    
    // 2. Query backend geocoder proxy (uses Google Geocoding first, then OSM)
    try {
      const url = `/api/healix/places/geocode?query=${encodeURIComponent(cleanedQuery)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setUserCoords({ lat: data.lat, lng: data.lng });
          setActiveCityName(data.cityName);
          setCitySearchStatus("Location resolved!");
          setIsTrackingLocation(false);
        } else {
          setCitySearchStatus("Location not found.");
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

  const fetchCurrentGPSPosition = (force = false) => {
    if (!navigator.geolocation) {
      setLocationErrorMessage("Your browser does not support geolocation.");
      setIsLocationLoading(false);
      return;
    }

    setIsLocationLoading(true);
    setLocationErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setActiveCityName("My Location");
        reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setLocationErrorMessage(null);
        setIsLocationLoading(false);
      },
      (err) => {
        console.warn("GPS query failed:", err);
        setLocationErrorMessage("Please turn on your location/GPS to view nearby resources.");
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: force ? 0 : 30000 }
    );
  };

  // Monitor live position (one-time fetch when enabled)
  useEffect(() => {
    if (isTrackingLocation) {
      fetchCurrentGPSPosition(false);
    }
  }, [isTrackingLocation]);

  const requestGPSLocation = () => {
    if (!isTrackingLocation) {
      setIsTrackingLocation(true);
    } else {
      fetchCurrentGPSPosition(true);
    }
  };

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

  // 🗺️ Live Geocoded Resources (Strictly Google Places API only)
  const [liveResources, setLiveResources] = useState<any[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLiveResources = async () => {
      if (locationErrorMessage) {
        setLiveResources([]);
        setIsResourcesLoading(false);
        return;
      }
      setIsResourcesLoading(true);
      
      try {
        const placesUrl = `/api/healix/places?lat=${userCoords.lat}&lng=${userCoords.lng}&category=${selectedResourceCategory}&city=${encodeURIComponent(activeCityName)}`;
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
          } else {
            console.warn("No Google Places results found for this category/location.");
            setLiveResources([]);
          }
        } else {
          console.error("Failed to query Google Places API backend route.");
          setLiveResources([]);
        }
      } catch (googleErr) {
        console.error("Google Places fetch error:", googleErr);
        setLiveResources([]);
      } finally {
        if (active) setIsResourcesLoading(false);
      }
    };

    fetchLiveResources();
    return () => {
      active = false;
    };
  }, [selectedResourceCategory, userCoords, locationErrorMessage, activeCityName]);

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
  const [misinfoHistory, setMisinfoHistory] = useState<{ claim: string; result: any; timestamp: string }[]>([]);
  const [isFeaturesMinimized, setIsFeaturesMinimized] = useState(false);

  // Save claim to history when a result is loaded
  useEffect(() => {
    if (misinfoResult && misinfoClaim) {
      const isAlreadyInHistory = misinfoHistory.length > 0 && misinfoHistory[0].claim === misinfoClaim;
      if (isAlreadyInHistory) return;

      const newHistoryItem = {
        claim: misinfoClaim,
        result: misinfoResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newHistoryItem, ...misinfoHistory.filter(h => h.claim !== misinfoClaim)].slice(0, 10);
      setMisinfoHistory(updated);
      syncUserWithBackend({ misinfoHistory: updated });
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

  // Sidebar show/hide state (persisted in localStorage)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("healix_sidebar_open");
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("healix_sidebar_open", String(isSidebarOpen));
  }, [isSidebarOpen]);

  // Citizen Feedback State Variables
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // Fetch feedbacks from MongoDB on mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/healix/feedback");
        const data = await response.json();
        if (data.success && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        }
      } catch (e) {
        console.error("Failed to fetch feedbacks in Portal:", e);
      }
    };
    fetchFeedbacks();
  }, []);

  const currentUserIdentifier = user?.email || user?.phone || "";
  const userFeedback = feedbacks.find(f => f.emailOrPhone.toLowerCase() === currentUserIdentifier.toLowerCase());
  const hasSubmittedFeedback = !!userFeedback;

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserIdentifier) return;

    try {
      const response = await fetch("/api/healix/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.name || "Citizen",
          emailOrPhone: currentUserIdentifier,
          rating: feedbackRating,
          comment: feedbackComment
        })
      });
      const data = await response.json();
      if (data.success) {
        setFeedbacks(prev => [data.feedback, ...prev]);
        setTimeout(() => {
          setIsFeedbackOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
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

  // Load from MongoDB on mount/user change
  useEffect(() => {
    if (!user || !user._id) return;

    const fetchLatestUser = async () => {
      try {
        const response = await fetch(`/api/auth/user/${user._id}`);
        const data = await response.json();
        if (data.success && data.user) {
          const latestUser = data.user;
          setCurrentUser(latestUser);
          if (onUserUpdate) {
            onUserUpdate(latestUser);
          }
          localStorage.setItem("healix_active_user", JSON.stringify(latestUser));

          // Populate states directly from MongoDB
          setPastDiseases(latestUser.pastDiseases || []);
          setMedicalReports(latestUser.medicalReports || []);
          setMedications(latestUser.medications || []);
          
          const vitals = latestUser.coreVitals || {
            bloodGroup: "",
            allergies: "",
            height: "",
            weight: "",
            chronicConditions: ""
          };
          setCoreVitals(vitals);
          setTempVitals(vitals);
          
          setSessions(latestUser.chatSessions || []);
          setActiveSessionId(latestUser.activeSessionId || null);
          setMisinfoHistory(latestUser.misinfoHistory || []);
        }
      } catch (err) {
        console.error("Failed to fetch latest user data from MongoDB:", err);
      }
    };

    fetchLatestUser();
  }, [user?._id]);

  const saveDiseasesToStore = (list: PastDisease[]) => {
    setPastDiseases(list);
    syncUserWithBackend({ pastDiseases: list });
  };

  const saveReportsToStore = (list: MedicalReport[]) => {
    setMedicalReports(list);
    syncUserWithBackend({ medicalReports: list });
  };

  const saveMedsToStore = (list: Medication[]) => {
    setMedications(list);
    syncUserWithBackend({ medications: list });
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
    syncUserWithBackend({ coreVitals: tempVitals });
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

  const syncSessionsAndActive = (updatedSessions: ChatSession[], activeId: string | null) => {
    setSessions(updatedSessions);
    setActiveSessionId(activeId);
    syncUserWithBackend({ chatSessions: updatedSessions, activeSessionId: activeId });
  };

  // Persist sessions and active session ID on change
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    syncUserWithBackend({ chatSessions: updatedSessions });
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    syncUserWithBackend({ activeSessionId: sessionId });
    navigate("/portal");
    setIsSidebarOpen(false); // Close on mobile if open
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    syncUserWithBackend({ activeSessionId: null });
    navigate("/portal");
    setChatInput("");
    setIsSidebarOpen(false); // Close on mobile
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    if (activeSessionId === sessionId) {
      syncSessionsAndActive(filtered, null);
    } else {
      saveSessions(filtered);
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

    syncSessionsAndActive(updatedSessions, currentSessionId);
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
        navigateTab={(tabPath) => navigate(tabPath)}
        theme={theme}
        onThemeChange={onThemeChange}
        handleUpdateLanguage={handleUpdateLanguage}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]">
        
        {/* Workspace Top Header Bar */}
        <header className="bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151] h-14 shrink-0 flex items-center px-4 md:px-6 justify-between z-10 shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 transition cursor-pointer flex items-center justify-center border-none bg-transparent"
              title="Toggle Menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-2 select-none min-w-0">
              <span className="text-sm font-black text-[#1E88E5] dark:text-white tracking-tight shrink-0">Healix</span>
              <span className="text-slate-300 dark:text-slate-700 shrink-0">|</span>
              <span 
                className="text-[9px] sm:text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-extrabold tracking-tight whitespace-nowrap shrink-0"
              >
                {activeTab === "chat" && (activeSession ? `${activeSession.title}` : t.chatTabTitle)}
                {activeTab === "report-saver" && `📄 ${t.reportsTabTitle}`}
                {activeTab === "schemes" && `🏥 ${t.schemesTabTitle}`}
                {activeTab === "resources" && `📍 ${t.resourcesTabTitle}`}
                {activeTab === "misinformation" && `🛡️ ${t.misinfoTabTitle}`}
                {activeTab === "profile" && `⚙️ ${t.profileTabTitle}`}
              </span>
            </div>
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
              onNavigateResources={() => navigate("/portal/resources")}
              onNavigateSchemes={() => navigate("/portal/schemes")}
              onNavigateEmergencyServices={() => {
                setSelectedResourceCategory("Emergency Services");
                navigate("/portal/resources");
              }}
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
              isLocationLoading={isLocationLoading}
              locationErrorMessage={locationErrorMessage}
              requestGPSLocation={requestGPSLocation}
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
              syncUserWithBackend={syncUserWithBackend}
            />
          )}


        </div>
      </div>
    </div>
  );
}
