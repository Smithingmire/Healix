import React, { useState, useEffect } from "react";
import { MessageSquare, Check, QrCode, Phone, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { TranslationSet } from "../translations";

interface WhatsappBotProps {
  t: TranslationSet;
}

export default function WhatsappBot({ t }: WhatsappBotProps) {
  const [botStatus, setBotStatus] = useState<"disconnected" | "initializing" | "qr" | "ready">("disconnected");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrImageUri, setQrImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Poll status endpoint every 3 seconds
  useEffect(() => {
    let active = true;

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/healix/whatsapp/status");
        if (res.ok && active) {
          const data = await res.json();
          if (data.success) {
            setBotStatus(data.status);
            setQrCodeData(data.qr);
            setQrImageUri(data.qrImage || null);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch WhatsApp bot status:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-1 sm:p-2 animate-fade-in">
      
      {/* Premium Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 p-8 sm:p-10 text-white shadow-xl shadow-emerald-500/10">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="h-3 w-3" /> Real-time Integration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.whatsappBotTabTitle || "Healix WhatsApp Companion"}
            </h2>
            <p className="text-emerald-50 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Bring Healix's symptom triaging, government schemes, and disease awareness directly to your phone. Talk, scan, and receive instant health support in Hindi and English.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-start md:justify-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Phone className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Connection Dashboard Status Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Activation Card & QR code display */}
        <div className="md:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-emerald-500" />
                <span>Link WhatsApp Device</span>
              </h3>
              
              {/* Dynamic status badge */}
              <div className="flex items-center">
                {botStatus === "ready" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-150">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Online & Linked
                  </span>
                )}
                {botStatus === "qr" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-150">
                    <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                    Scan Pending
                  </span>
                )}
                {botStatus === "initializing" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-150">
                    <span className="h-2 w-2 rounded-full bg-blue-500 inline-block animate-ping"></span>
                    Initializing...
                  </span>
                )}
                {botStatus === "disconnected" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-150">
                    <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
                    Offline
                  </span>
                )}
              </div>
            </div>

            {/* Render conditional QR state */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading connection state...</p>
              </div>
            ) : botStatus === "qr" && qrImageUri ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-scale-in">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
                  <img 
                    src={qrImageUri} 
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
                <div className="text-center max-w-sm space-y-2">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Scan this QR Code</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Open WhatsApp on your phone → Settings → Linked Devices → Link a Device. Point your camera at the code above.
                  </p>
                </div>
              </div>
            ) : botStatus === "ready" ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-scale-in">
                <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border border-emerald-150 shadow-inner">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <div className="text-center max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white">Successfully Linked!</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Healix health assistant is currently online and active on your WhatsApp account. Any direct message received will be processed and answered.
                  </p>
                </div>
              </div>
            ) : botStatus === "initializing" ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 border-r-2 border-r-transparent"></div>
                <div className="text-center max-w-xs space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Launching Chrome Instance</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    The backend is preparing the headless Chromium browser. Please wait...
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center border border-rose-150">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="max-w-xs space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Bot Server is Offline</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Make sure the backend is active by running <code className="bg-slate-50 dark:bg-[#111827] px-1 py-0.5 rounded text-red-500 text-[9px] font-mono">node server.js</code> inside the backend folder to boot the service.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Box */}
          <div className="bg-white dark:bg-[#1F2937] border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-[#F9FAFB]">Symptom Awareness & Triage</h4>
              <p className="text-slate-550 dark:text-[#9CA3AF] text-[10px] leading-relaxed">
                The bot responds immediately to incoming messages. It checks symptoms, alerts the user of critical clinical red flags, and is fully bilingual (Hindi & English).
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Phone Simulator */}
        <div className="md:col-span-5 flex justify-center">
          
          <div className="w-full max-w-[320px] bg-slate-950 dark:bg-slate-900 border-[8px] border-slate-800 dark:border-slate-950 rounded-[40px] shadow-2xl relative overflow-hidden aspect-[9/18] flex flex-col">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-800 dark:bg-slate-950 rounded-full z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 dark:bg-slate-900 rounded-full mr-2"></div>
              <div className="w-2.5 h-2.5 bg-slate-700 dark:bg-slate-900 rounded-full"></div>
            </div>

            {/* WhatsApp Header bar */}
            <div className="bg-[#075E54] text-white pt-9 pb-3 px-4 flex items-center gap-2.5 select-none shrink-0 shadow-md">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                H
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold truncate">Healix Health Bot</h4>
                <p className="text-[9px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full inline-block ${botStatus === "ready" ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}></span>
                  <span>{botStatus === "ready" ? "online" : "offline"}</span>
                </p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#ECE5DD] dark:bg-slate-950/90 p-4 space-y-3 overflow-y-auto no-scrollbar flex flex-col justify-end text-[11px] leading-relaxed">
              
              {/* User message */}
              <div className="self-end bg-[#DCF8C6] dark:bg-emerald-800/20 dark:text-emerald-100 max-w-[85%] rounded-xl rounded-tr-none px-3 py-2 shadow-xs text-slate-800">
                मुझे कल रात से बुखार है और बदन दर्द हो रहा है (I have a fever and body pain since last night)
                <span className="block text-[8px] text-slate-400 dark:text-slate-500 text-right mt-1 font-mono">10:32 AM</span>
              </div>

              {/* Bot response */}
              <div className="self-start bg-white dark:bg-slate-850 dark:text-slate-200 max-w-[85%] rounded-xl rounded-tl-none px-3 py-2 shadow-xs text-slate-800 space-y-2">
                <p className="font-extrabold text-[#075E54] dark:text-emerald-400">लक्षणों का अवलोकन (Symptom Overview)</p>
                <p>प्रिय नागरिक, कृपया शांत रहें। हल्के बुखार और बदन दर्द सामान्यतः वायरल संक्रमण या थकान के कारण होते हैं। घबराएं नहीं।</p>
                
                <p className="font-extrabold text-amber-500">चिंता का स्तर (Concern Level)</p>
                <p>🟡 लक्षणों की निगरानी करें (Monitor Symptoms)</p>
                
                <p className="font-extrabold text-[#075E54] dark:text-emerald-400">स्व-देखभाल (Self-Care)</p>
                <p>🔹 1. पर्याप्त मात्रा में पानी पिएं और आराम करें।<br/>🔹 2. हल्का और ताजा भोजन लें।</p>
                
                <span className="block text-[8px] text-slate-400 dark:text-slate-500 text-right mt-1 font-mono">10:32 AM</span>
              </div>

            </div>

            {/* Input simulator footer */}
            <div className="bg-slate-100 dark:bg-slate-900 p-2 flex items-center gap-2 select-none shrink-0 border-t border-slate-200/50 dark:border-slate-950">
              <div className="flex-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 text-slate-400 text-[10px]">
                Type a message...
              </div>
              <div className="h-7 w-7 rounded-full bg-[#075E54] dark:bg-emerald-600 flex items-center justify-center text-white text-xs">
                ➜
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
