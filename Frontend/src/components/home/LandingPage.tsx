import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, MessageCircle, Phone, Heart, ShieldAlert, FileText, Globe, MapPin, Search, Sun, Moon, Menu, X, Star, Check } from "lucide-react";
import OrbitalAnimation from "./OrbitalAnimation";

interface LandingPageProps {
  onLogin: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export default function LandingPage({ onLogin, theme, onThemeChange }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmailOrPhone, setFeedbackEmailOrPhone] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  // Load registered count & feedbacks
  useEffect(() => {
    // Registered count
    const rawUsers = localStorage.getItem("healix_registered_users");
    if (rawUsers) {
      try {
        const parsed = JSON.parse(rawUsers);
        if (Array.isArray(parsed)) {
          setRegisteredUsersCount(parsed.length);
        }
      } catch (e) {}
    }

    // Feedbacks list
    const rawFeedbacks = localStorage.getItem("healix_feedbacks");
    if (rawFeedbacks) {
      try {
        const parsed = JSON.parse(rawFeedbacks);
        if (Array.isArray(parsed)) {
          setFeedbacks(parsed);
        }
      } catch (e) {}
    }
  }, []);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess("");
    setFeedbackError("");

    if (!feedbackName || !feedbackEmailOrPhone || !feedbackComment) return;

    // Check if duplicate feedback exists
    const exists = feedbacks.some(
      (f) => f.emailOrPhone.toLowerCase() === feedbackEmailOrPhone.toLowerCase()
    );

    if (exists) {
      setFeedbackError("You have already submitted feedback once.");
      return;
    }

    const newFeedback = {
      emailOrPhone: feedbackEmailOrPhone,
      rating: feedbackRating,
      comment: feedbackComment,
      userName: feedbackName,
      date: new Date().toLocaleDateString()
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("healix_feedbacks", JSON.stringify(updated));
    setFeedbackSuccess("Thank you! Your feedback has been saved.");
    setFeedbackComment("");
    setFeedbackName("");
    setFeedbackEmailOrPhone("");
    setFeedbackRating(5);
  };

  // Smooth scroll to features
  const scrollToFeatures = () => {
    const element = document.getElementById("capabilities-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToVision = () => {
    const element = document.getElementById("vision-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] font-sans overflow-x-hidden selection:bg-blue-100 selection:text-[#1E88E5] transition-colors duration-200">
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 bg-white/90 dark:bg-[#111827]/95 backdrop-blur-md z-50 border-b border-slate-100/80 dark:border-[#374151] transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center select-none">
            <span className="text-2xl sm:text-3xl font-black text-[#0D2A6B] dark:text-white tracking-tight leading-none">
              Healix
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={scrollToFeatures}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={scrollToVision}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer"
            >
              Vision
            </button>
            
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-700"></span>

            {/* Premium subtle Theme Switcher */}
            <button
              type="button"
              onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer flex items-center justify-center border border-slate-100 dark:border-slate-700/50"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* Login CTA */}
            <button
              onClick={onLogin}
              className="bg-[#1E88E5] hover:bg-blue-600 text-white text-sm font-semibold rounded-full px-6 py-2.5 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition duration-200 cursor-pointer"
            >
              Login
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2.5">
            {/* Theme switcher */}
            <button
              type="button"
              onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer flex items-center justify-center border border-slate-100 dark:border-slate-700/50"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-300 hover:text-[#1E88E5] dark:hover:text-blue-400 transition cursor-pointer flex items-center justify-center border border-slate-100 dark:border-slate-700/50"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-xl z-40 p-5 flex flex-col gap-3 animate-fade-in transition-all">
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToFeatures();
            }}
            className="w-full text-left py-3 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Features
          </button>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToVision();
            }}
            className="w-full text-left py-3 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Vision
          </button>
          
          <div className="h-px bg-slate-100 dark:bg-[#374151] my-1"></div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLogin();
            }}
            className="w-full bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-bold rounded-xl py-3 shadow-md text-center block transition"
          >
            Login to Healix
          </button>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative pt-6 pb-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[2.5rem] sm:text-[3.5rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-2xl"
            >
              AI <span className="text-[#1E88E5] relative inline-block">healthcare assistant</span> for every citizen.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed mt-4 max-w-xl"
            >
              Healix brings trusted medical guidance, symptom analysis, and government scheme support directly into the hands of every citizen — through voice and text, in your own language.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto"
            >
              <button
                onClick={onLogin}
                className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold rounded-xl px-6 py-3.5 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Started — Login</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToFeatures}
                className="bg-white dark:bg-transparent border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-xl px-6 py-3.5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-200 text-sm flex items-center justify-center cursor-pointer"
              >
                Explore Features
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3 mt-7 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 px-4 py-2.5 rounded-2xl select-none"
            >
              <div className="flex -space-x-2">
                <div className="w-6.5 h-6.5 rounded-full bg-blue-500 border border-white dark:border-slate-850 flex items-center justify-center text-[10px] font-bold text-white uppercase">H</div>
                <div className="w-6.5 h-6.5 rounded-full bg-emerald-500 border border-white dark:border-slate-850 flex items-center justify-center text-[10px] font-bold text-white uppercase">X</div>
                <div className="w-6.5 h-6.5 rounded-full bg-orange-500 border border-white dark:border-slate-850 flex items-center justify-center text-[10px] font-bold text-white uppercase">C</div>
              </div>
              <p className="text-[11px] text-slate-550 dark:text-slate-300 font-bold uppercase tracking-wider">
                Trusted by <span className="text-[#1E88E5] dark:text-blue-400 font-extrabold">{registeredUsersCount}</span> {registeredUsersCount === 1 ? "user" : "users"}
              </p>
            </motion.div>
          </div>

          {/* Right 3D Mockup Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-8 lg:py-4">
            <OrbitalAnimation />
          </div>

        </div>
      </section>

      {/* 3. CAPABILITIES / FEATURES SECTION */}
      <section id="capabilities-section" className="py-12 lg:py-16 bg-[#FAFCFF] dark:bg-[#111827] border-t border-b border-slate-100 dark:border-[#374151]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Section Headers */}
          <div className="text-left mb-10 max-w-3xl">
            <span className="text-sm sm:text-base font-extrabold tracking-widest text-[#0066FF] dark:text-blue-400 uppercase mb-3 block">Features</span>
            <h2 className="text-[1.75rem] sm:text-[2.2rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              One solution. Five ways to support your health.
            </h2>
          </div>

          {/* Grid Layout matching the 5 cards + 1 empty block precisely */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 01 */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-white dark:hover:from-[#1F2937] dark:hover:to-[#111827] transition-all duration-300 flex flex-col justify-between gap-8 group">
              <span className="text-xs font-bold text-blue-400 font-mono tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">01</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  AI Symptom & Disease Guidance
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">
                  Describe symptoms naturally and get possible conditions, severity, prevention, and disease awareness — all in one conversation.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-white dark:hover:from-[#1F2937] dark:hover:to-[#111827] transition-all duration-300 flex flex-col justify-between gap-8 group">
              <span className="text-xs font-bold text-blue-400 font-mono tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">02</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Multilingual Voice Assistant
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">
                  Talk or type in regional Indian languages directly on the web — designed for elderly, rural, and low-literacy users.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-white dark:hover:from-[#1F2937] dark:hover:to-[#111827] transition-all duration-300 flex flex-col justify-between gap-8 group">
              <span className="text-xs font-bold text-blue-400 font-mono tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">03</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Healthcare Resource Finder
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">
                  Instantly locate nearby hospitals, PHCs, ambulances, and emergency services around you.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-white dark:hover:from-[#1F2937] dark:hover:to-[#111827] transition-all duration-300 flex flex-col justify-between gap-8 group">
              <span className="text-xs font-bold text-blue-400 font-mono tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">04</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Government Scheme Assistant
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">
                  Ayushman Bharat, PM-JAY and state schemes — eligibility, documents, and how to apply.
                </p>
              </div>
            </div>

            {/* Card 05 */}
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-white dark:hover:from-[#1F2937] dark:hover:to-[#111827] transition-all duration-300 flex flex-col justify-between gap-8 group">
              <span className="text-xs font-bold text-blue-400 font-mono tracking-tight group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">05</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Personal Records & Community Alerts
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">
                  Save symptom history and revisit reports anytime; anonymous trends power area-wise outbreak and seasonal alerts.
                </p>
              </div>
            </div>



          </div>

        </div>
      </section>

      {/* 4. VISION SECTION */}
      <section id="vision-section" className="py-14 bg-white dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Pristine Centered Card representing our vision */}
          <div className="max-w-5xl mx-auto bg-gradient-to-b from-slate-50/50 to-white dark:from-[#1F2937] dark:to-[#111827] border border-slate-100 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
            
            {/* Soft decorative background circles */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
            
            <span className="text-sm sm:text-base font-extrabold tracking-widest text-[#1E88E5] uppercase mb-4 block">Our Vision</span>
            
            <h2 className="text-[1.75rem] sm:text-[2.5rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-3xl mt-2">
              Healthcare guidance for <span className="text-[#1E88E5]">every citizen</span>, anytime, anywhere.
            </h2>
            
            <p className="text-slate-500 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 max-w-2xl font-light">
              Empowering citizens with trusted healthcare information and building healthier communities through intelligent technology.
            </p>

            <button
              onClick={onLogin}
              className="bg-[#1E88E5] hover:bg-blue-600 text-white font-semibold rounded-xl px-6 py-3.5 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition duration-200 mt-6 text-sm cursor-pointer"
            >
              Login to Open Healix
            </button>

          </div>
        </div>
      </section>

      {/* 4. FEEDBACK SECTION */}
      <section id="feedback-section" className="py-16 bg-[#F8FAFC] dark:bg-[#111827] border-t border-b border-slate-100 dark:border-[#374151]">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block font-mono">Live Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              What Citizens are Saying
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Real feedback and ratings submitted by users of Healix.
            </p>
          </div>

          {feedbacks.length === 0 ? (
            <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-505 text-sm font-light shadow-xs max-w-xl mx-auto">
              No citizen reviews yet. Feedback submitted via the Healix Portal dashboard will appear here!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {feedbacks.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-[#1F2937] border border-slate-150 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 hover:border-blue-200 hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-center gap-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.userName}</h4>
                    <span className="text-[10px] text-slate-405 dark:text-slate-500 font-mono shrink-0">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-655 dark:text-slate-300 italic font-light leading-relaxed line-clamp-4">
                    "{item.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-8 pb-8 transition-colors">
        {/* Disclaimer & Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 border-t border-slate-800/80 pt-8 flex flex-col gap-6">
          <div className="bg-slate-950 border border-slate-800/50 p-4.5 rounded-2xl">
            <p className="text-[10px] text-slate-400 leading-relaxed font-light">
              <strong className="text-slate-300">Disclaimer:</strong> Healix is an AI-powered conversational assistant designed exclusively to provide public healthcare information and disease awareness support. It is strictly not a clinical diagnostics tool or an alternative to consulting professional medical practitioners, doctors, or emergency clinical providers. Always seek physical medical attention immediately if you encounter critical, severe, or emergency wellness situations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
            <p className="font-light">© 2024 Healix. Empowering Indian communities with digital-first wellness accessibility.</p>
            <div className="flex gap-6 font-light">
              <button 
                onClick={() => setModalType("terms")}
                className="hover:text-slate-200 transition cursor-pointer bg-transparent border-none text-left p-0 text-[11px] font-light text-[#1E88E5] hover:underline"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => setModalType("privacy")}
                className="hover:text-slate-200 transition cursor-pointer bg-transparent border-none text-left p-0 text-[11px] font-light text-[#1E88E5] hover:underline"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal overlay window */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-850 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
            
            {modalType === "terms" ? (
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
            ) : (
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Privacy Policy</h3>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-1 leading-relaxed no-scrollbar">
                  <p className="font-semibold text-slate-800 dark:text-white">1. Data Ownership</p>
                  <p>Your healthcare records, messages, and files belong to you. Everything is securely stored in local browser sandboxes.</p>
                  
                  <p className="font-semibold text-slate-800 dark:text-white">2. No Third-Party Selling</p>
                  <p>Healix does not transmit, store, or sell your personal details or conversational logs to external cloud storage servers.</p>
                  
                  <p className="font-semibold text-slate-800 dark:text-white">3. Anonymity Control</p>
                  <p>Users can instantly clear all session histories, registration profiles, and cached document databases directly via the logout action.</p>
                </div>
              </div>
            )}
              
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalType(null)}
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
