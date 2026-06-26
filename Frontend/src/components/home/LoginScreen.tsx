import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Phone, Mail, Lock, User, Sparkles, ArrowRight, ArrowLeft, Sun, Moon, X } from "lucide-react";
import { UserSession } from "../../types";

interface LoginScreenProps {
  onLoginSuccess: (user: UserSession) => void;
  onBack: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function LoginScreen({ onLoginSuccess, onBack, theme, onThemeChange }: LoginScreenProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Registration States
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regPincode, setRegPincode] = useState("");
  const [regLanguage, setRegLanguage] = useState("English");
  const [regLatitude, setRegLatitude] = useState<number | null>(null);
  const [regLongitude, setRegLongitude] = useState<number | null>(null);
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request location permission during registration initialization
  React.useEffect(() => {
    if (!isLoginTab && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRegLatitude(position.coords.latitude);
          setRegLongitude(position.coords.longitude);
        },
        (err) => {
          console.warn("Location permission not granted/available:", err.message);
        }
      );
    }
  }, [isLoginTab]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabChange = (isLogin: boolean) => {
    setIsLoginTab(isLogin);
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) return;
    
    // Retrieve registered users database from localStorage
    const savedUsersRaw = localStorage.getItem("healix_registered_users");
    const savedUsers: UserSession[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    
    // Match with registered users
    const matchedUser = savedUsers.find(
      u => u.email?.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    if (matchedUser) {
      const activeLang = (matchedUser.language && (matchedUser.language.toLowerCase().includes("hind") || matchedUser.language === "Hindi")) ? "hi" : "en";
      localStorage.setItem("healix_active_language", activeLang);
      onLoginSuccess(matchedUser);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName || !regPhone || !regLocation || !regPincode || !regEmail || !regPassword) return;

    if (!regAcceptedTerms) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    // Retrieve registered users database from localStorage
    const savedUsersRaw = localStorage.getItem("healix_registered_users");
    const savedUsers: UserSession[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

    // Check for duplicate email or phone
    const emailExists = savedUsers.some(u => u.email?.toLowerCase() === regEmail.toLowerCase());
    const phoneExists = savedUsers.some(u => u.phone === regPhone);
    if (emailExists) {
      setError("This email is already registered");
      return;
    }
    if (phoneExists) {
      setError("This phone number is already registered");
      return;
    }

    const newUser: UserSession = {
      name: regName,
      phone: regPhone,
      pincode: regPincode || "400001",
      age: 38,
      gender: "Male",
      location: regLocation,
      language: regLanguage,
      email: regEmail,
      password: regPassword,
      latitude: regLatitude || 19.0760, // Fallback Mumbai lat
      longitude: regLongitude || 72.8777 // Fallback Mumbai lng
    };

    const updatedUsers = [newUser, ...savedUsers];
    localStorage.setItem("healix_registered_users", JSON.stringify(updatedUsers));

    const activeLang = (regLanguage.toLowerCase().includes("hind") || regLanguage === "Hindi") ? "hi" : "en";
    localStorage.setItem("healix_active_language", activeLang);
    onLoginSuccess(newUser);
  };


  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center p-6 overflow-hidden font-sans select-none transition-colors duration-200">
      
      {/* Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
          className="p-2.5 rounded-xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 1. CLEAN MODERN COMPANION CARD */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1F2937] border border-slate-200/80 dark:border-[#374151] shadow-xl shadow-slate-100/50 dark:shadow-none rounded-3xl p-8 z-10 flex flex-col items-center transition-all duration-200">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-6 select-none">
          <span className="text-3xl font-black text-[#1E88E5] dark:text-white tracking-tight">
            Healix
          </span>
        </div>

        {/* Tabs */}
        <div className="w-full grid grid-cols-2 bg-slate-100 dark:bg-[#111827] p-1 rounded-2xl mb-8 border border-slate-200/40 dark:border-[#374151]/50">
          <button
            onClick={() => handleTabChange(true)}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isLoginTab 
                ? "bg-white dark:bg-[#1F2937] text-slate-900 dark:text-[#F9FAFB] shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Login / Sign In
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isLoginTab 
                ? "bg-white dark:bg-[#1F2937] text-slate-900 dark:text-[#F9FAFB] shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Register Citizen
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isLoginTab ? (
            /* LOGIN CARD */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col gap-5"
            >
              <div className="text-center mb-1">
                <h3 className="text-lg font-bold text-slate-900">Welcome Back</h3>
                <p className="text-xs text-slate-500 mt-1">Authenticate using your email and password.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 text-xs px-3 py-2.5 rounded-xl text-center font-medium animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gmail / Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rajesh@gmail.com"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!loginEmail || !loginPassword}
                  className="w-full bg-[#1E88E5] hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-400 text-white text-sm font-semibold py-3.5 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Login & Access Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* REGISTER CARD */
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col gap-4"
            >
              <div className="text-center mb-1">
                <h3 className="text-lg font-bold text-slate-900">Create Citizen Profile</h3>
                <p className="text-xs text-slate-500 mt-1">Register to start tracking personal health history and schemes.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 text-xs px-3 py-2.5 rounded-xl text-center font-medium animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit number"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Email (Required) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Gmail / Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. rajesh@gmail.com"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Preferred Language */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Preferred Language</label>
                  <select
                    value={regLanguage}
                    onChange={(e) => setRegLanguage(e.target.value)}
                    required
                    className="w-full bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                  </select>
                </div>

                {/* City & State / Region */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">City & State / Region</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Maharashtra or Gujarat"
                      required
                      className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Pincode</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regPincode}
                      onChange={(e) => setRegPincode(e.target.value)}
                      placeholder="e.g. 400001"
                      required
                      maxLength={6}
                      className="w-full bg-white/70 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] transition font-medium"
                    />
                  </div>
                </div>

                {/* Terms and conditions Checkbox */}
                <div className="flex items-start gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    checked={regAcceptedTerms}
                    onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                    required
                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-[#1E88E5] focus:ring-[#1E88E5] cursor-pointer"
                  />
                  <label htmlFor="termsCheckbox" className="text-[10px] text-slate-500 dark:text-slate-400 select-none cursor-pointer leading-tight">
                    I accept the <span className="text-[#1E88E5] font-semibold hover:underline" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms & Conditions</span> and consent to secure local data caching.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!regName || regPhone.length < 10 || !regLocation || !regPincode || !regEmail || !regPassword || !regAcceptedTerms}
                  className="w-full bg-[#1E88E5] hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-400 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer mt-2"
                >
                  Create Account & Login
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Homepage Link */}
        <button
          onClick={onBack}
          className="mt-6 text-xs text-slate-400 hover:text-[#1E88E5] font-medium transition cursor-pointer flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Return to Homepage</span>
        </button>

      </div>

      {/* Terms & Conditions Modal Overlay */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Terms & Conditions</h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-1 leading-relaxed no-scrollbar">
                <p className="font-semibold text-slate-800 dark:text-white">1. Informational Purpose Only</p>
                <p>Healix is an AI-powered conversational utility. The guidance, translations, or resources generated do not substitute professional medical diagnosis, clinical care, or emergency medical treatment.</p>
                
                <p className="font-semibold text-slate-800 dark:text-white">2. Secure Local Identity Storage</p>
                <p>All private data, profile details, uploaded documents, and dialogue histories remain sandboxed locally on your browser using localStorage APIs.</p>
                
                <p className="font-semibold text-slate-800 dark:text-white">3. Not a Clinical Tool</p>
                <p>You agree to consult licensed healthcare providers for diagnostic questions, clinical prescriptions, or severe medical scenarios.</p>
              </div>
            </div>
              
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
