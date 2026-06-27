import React, { FormEvent, RefObject } from "react";
import { 
  Send, Mic, MicOff, Volume2, Play, Pause, Square,
  Activity, Heart, Shield, Clock, Phone, Stethoscope, 
  RefreshCw, BookOpen, AlertOctagon, CheckCircle2, 
  XCircle, HelpCircle, MapPin 
} from "lucide-react";
import { Message, UserSession } from "../../types";
import { TranslationSet } from "../translations";

interface ChatAssistantProps {
  chatMessages: Message[];
  t: TranslationSet;
  userProfile: UserSession;
  chatInput: string;
  setChatInput: (s: string) => void;
  isChatLoading: boolean;
  isListeningInput: boolean;
  isPlayingVoice: string | null;
  isPausedVoice: boolean;
  currentLang: string;
  chatEndRef: RefObject<HTMLDivElement | null>;
  handleSendChatMessage: (e: FormEvent) => void;
  handleSuggestionClick: (sug: string) => void;
  startSpeechRecognition: () => void;
  stopSpeechRecognition: () => void;
  speakText: (text: string, msgId: string, lang: string) => void;
  pauseVoice: () => void;
  resumeVoice: () => void;
  stopVoice: () => void;
  cleanChatSymbols: (text: string) => string;
  onNavigateResources?: () => void;
  onNavigateSchemes?: () => void;
  onNavigateEmergencyServices?: () => void;
}

const reportHeaders = {
  en: {
    symptomSummary: "Symptom Summary",
    possibleConditions: "💡 Possible Causes (General Only)",
    selfCare: "🧾 What You Should Do Now",
    recoveryTimeline: "Expected Recovery Timeline",
    emergencyWarning: "🚨 Emergency Warning Signs",
    medicationInfo: "Medication Information",
    preventionTips: "Prevention Tips",
    actionFindHospitals: "Find Nearby Hospitals",
    actionCallEmergency: "Call Emergency Services",
    actionCheckSymptom: "Check Another Symptom",
    actionLearnMore: "Learn More about Schemes"
  },
  hi: {
    symptomSummary: "लक्षणों का सारांश",
    possibleConditions: "💡 संभावित कारण (केवल सामान्य)",
    selfCare: "🧾 आपको अब क्या करना चाहिए",
    recoveryTimeline: "संभावित सुधार समयरेखा",
    emergencyWarning: "🚨 आपातकालीन चेतावनी संकेत",
    medicationInfo: "दवा संबंधी जानकारी",
    preventionTips: "बचाव के उपाय",
    actionFindHospitals: "नजदीकी अस्पताल खोजें",
    actionCallEmergency: "आपातकालीन सेवा को कॉल करें",
    actionCheckSymptom: "एक और लक्षण जांचें",
    actionLearnMore: "योजनाओं के बारे में और जानें"
  }
};

function HealthReportView({ 
  report, 
  currentLang, 
  onNavigateResources, 
  onNavigateSchemes, 
  onNavigateEmergencyServices,
  setChatInput 
}: { 
  report: any; 
  currentLang: string; 
  onNavigateResources?: () => void; 
  onNavigateSchemes?: () => void; 
  onNavigateEmergencyServices?: () => void;
  setChatInput: (s: string) => void 
}) {
  const headers = reportHeaders[currentLang as "en" | "hi"] || reportHeaders.en;
  
  let cardBorder = "border-emerald-500/20 dark:border-emerald-500/10";
  let cardGlow = "shadow-emerald-500/5";
  let concernText = "text-emerald-600 dark:text-emerald-450";
  let concernBg = "bg-emerald-50 dark:bg-emerald-950/20";
  
  if (report.concernLevel === "medium") {
    cardBorder = "border-amber-500/20 dark:border-amber-500/10";
    cardGlow = "shadow-amber-500/5";
    concernText = "text-amber-600 dark:text-amber-400";
    concernBg = "bg-amber-50 dark:bg-amber-950/20";
  } else if (report.concernLevel === "high") {
    cardBorder = "border-rose-500/20 dark:border-rose-500/10";
    cardGlow = "shadow-rose-500/5";
    concernText = "text-rose-600 dark:text-rose-450";
    concernBg = "bg-rose-50 dark:bg-rose-950/20";
  }

  return (
    <div className={`w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-2xl border ${cardBorder} shadow-lg ${cardGlow} p-5 space-y-6 text-slate-800 dark:text-[#F9FAFB] transition-all duration-300 ease-in-out`}>
      
      {/* 👋 Greeting & concern card */}
      <div className={`${concernBg} border border-transparent rounded-2xl p-4.5 space-y-4`}>
        <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-snug">
          <span>👋</span> {report.greeting}
        </h2>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span className="text-slate-700 dark:text-slate-300">🩺 {currentLang === "hi" ? "ट्राइएज स्तर:" : "Triage Level:"}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm ${concernText} bg-white dark:bg-[#0F172A]`}>
              {report.concernBadge}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-extrabold text-slate-755 dark:text-slate-250 flex items-center gap-1">
            📌 {currentLang === "hi" ? "कारण" : "Reasoning"}
          </h3>
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350 font-medium">
            {report.concernExplanation}
          </p>
        </div>
      </div>

      {/* 📊 Symptom Summary */}
      {report.symptoms && report.symptoms.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3>{headers.symptomSummary}</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {report.symptoms.map((sym: any, idx: number) => {
              let badgeStyle = "bg-slate-50 text-slate-600 border border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-800";
              let icon = <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />;
              if (sym.status === "present") {
                badgeStyle = "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850";
                icon = <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />;
              } else if (sym.status === "absent") {
                badgeStyle = "bg-slate-100/60 text-slate-400 border border-slate-200/40 line-through dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800/80";
                icon = <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />;
              }
              return (
                <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide shadow-2xs transition duration-150 ${badgeStyle}`}>
                  {icon}
                  {sym.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 🧠 Possible Conditions */}
      {report.conditions && report.conditions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            <Heart className="h-4 w-4 text-rose-500 dark:text-rose-450 animate-pulse" />
            <h3>{headers.possibleConditions}</h3>
          </div>
          <div className="space-y-3.5 pt-1.5">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic">
              {currentLang === "hi" ? "आपके लक्षणों के आधार पर ये स्थितियां संबंधित हो सकती हैं:" : "Based on your symptoms, these conditions could be related:"}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {report.conditions.map((cond: any, idx: number) => (
                <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-55/60 text-slate-700 border border-slate-200/60 dark:bg-slate-800/30 dark:text-slate-350 dark:border-slate-800 shadow-2xs">
                  🔹 {cond.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 💡 Recommended Self-Care */}
      {report.selfCare && report.selfCare.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            <Shield className="h-4 w-4 text-emerald-500 dark:text-emerald-450" />
            <h3>{headers.selfCare}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {report.selfCare.map((item: string, idx: number) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-2xs hover:shadow-xs transition duration-150 flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 text-xs">
                  ✨
                </div>
                <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📅 Expected Recovery Timeline */}
      {report.timeline && report.timeline.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <h3>{headers.recoveryTimeline}</h3>
          </div>
          <div className="space-y-4 relative pl-4 border-l border-slate-200 dark:border-slate-800 mt-3 ml-2.5">
            {report.timeline.map((item: any, idx: number) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[21.5px] top-1 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-[#1E293B]"></div>
                <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200">{item.phase}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚨 Emergency Warning Signs */}
      {report.emergencyWarnings && report.emergencyWarnings.length > 0 && (
        <div className="border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10 p-4.5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-450 font-extrabold text-xs">
            <AlertOctagon className="h-4.5 w-4.5 shrink-0 text-rose-650 dark:text-rose-450" />
            <h3>{headers.emergencyWarning}</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-0.5">
            {report.emergencyWarnings.map((item: string, idx: number) => (
              <li key={idx} className="text-[11px] text-rose-950 dark:text-rose-300 flex items-start gap-2 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-rose-100/50 dark:border-rose-950/40 shadow-2xs font-semibold">
                <span className="text-rose-500">🚨</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold italic pt-1 flex items-center gap-1.5 leading-snug">
            ⚠️ {currentLang === "hi" ? "यदि इनमें से कोई भी लक्षण दिखाई दे तो तुरंत चिकित्सीय सहायता लें।" : "Seek professional medical care immediately if any of these symptoms occur."}
          </p>
        </div>
      )}

      {/* 💊 Medication Information */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
          <Stethoscope className="h-4.5 w-4.5 text-blue-600 dark:text-blue-450" />
          <h3>{headers.medicationInfo}</h3>
        </div>
        <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold italic">
          {report.medicationStatement}
        </p>
      </div>

      {/* 🛡 Prevention Tips */}
      {report.preventionTips && report.preventionTips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            <Shield className="h-4 w-4 text-emerald-500" />
            <h3>{headers.preventionTips}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {report.preventionTips.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 bg-slate-50/50 dark:bg-slate-800/20 px-3 py-2.5 rounded-xl border border-slate-100/60 dark:border-slate-800/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ❤️ Recovery Footer */}
      <div className="bg-blue-50/30 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100/30 dark:border-blue-900/30 text-center">
        <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold leading-relaxed">
          {report.reassuranceMessage}
        </p>
      </div>

      {/* ⚠️ Disclaimer at the end of response */}
      <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
        <p className="text-[10.5px] text-slate-450 dark:text-slate-500 italic font-medium leading-relaxed">
          ⚠️ <strong>{currentLang === "hi" ? "अस्वीकरण:" : "Disclaimer:"}</strong> {report.disclaimer}
        </p>
      </div>

      {/* Interactive Actions CTA Footer */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 justify-end">
        {onNavigateResources && (
          <button
            onClick={onNavigateResources}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold shadow-sm shadow-blue-500/20 hover:shadow-md transition cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5" />
            {headers.actionFindHospitals}
          </button>
        )}
        {onNavigateEmergencyServices ? (
          <button
            onClick={onNavigateEmergencyServices}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold shadow-sm shadow-rose-500/20 hover:shadow-md transition cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
            {headers.actionCallEmergency}
          </button>
        ) : (
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold shadow-sm shadow-rose-500/20 hover:shadow-md transition cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
            {headers.actionCallEmergency}
          </a>
        )}
        <button
          onClick={() => {
            setChatInput("");
            const textarea = document.querySelector('textarea');
            if (textarea) {
              (textarea as HTMLTextAreaElement).focus();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 text-[11px] font-extrabold transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {headers.actionCheckSymptom}
        </button>
        {onNavigateSchemes && (
          <button
            onClick={onNavigateSchemes}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 text-[11px] font-extrabold transition cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {headers.actionLearnMore}
          </button>
        )}
      </div>

    </div>
  );
}

export default function ChatAssistant({
  chatMessages,
  t,
  userProfile,
  chatInput,
  setChatInput,
  isChatLoading,
  isListeningInput,
  isPlayingVoice,
  isPausedVoice,
  currentLang,
  chatEndRef,
  handleSendChatMessage,
  handleSuggestionClick,
  startSpeechRecognition,
  stopSpeechRecognition,
  speakText,
  pauseVoice,
  resumeVoice,
  stopVoice,
  cleanChatSymbols,
  onNavigateResources,
  onNavigateSchemes,
  onNavigateEmergencyServices
}: ChatAssistantProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const renderModelMessage = (msg: Message) => {
    let reportData: any = null;
    let isHealthReport = false;

    try {
      if (msg.content && msg.content.trim().startsWith("{") && msg.content.trim().endsWith("}")) {
        reportData = JSON.parse(msg.content);
        if (reportData && reportData.isHealthReport) {
          isHealthReport = true;
        }
      }
    } catch (e) {
      // not a health report
    }

    if (isHealthReport && reportData) {
      return (
        <HealthReportView 
          report={reportData} 
          currentLang={currentLang} 
          onNavigateResources={onNavigateResources} 
          onNavigateSchemes={onNavigateSchemes} 
          onNavigateEmergencyServices={onNavigateEmergencyServices}
          setChatInput={setChatInput} 
        />
      );
    }

    const textToShow = reportData && !reportData.isHealthReport && reportData.conversationalResponse
      ? reportData.conversationalResponse
      : cleanChatSymbols(msg.content);

    return (
      <div className="px-4.5 py-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs bg-white dark:bg-[#1F2937] text-slate-800 dark:text-[#F9FAFB] rounded-tl-none border border-slate-200/60 dark:border-[#374151]">
        {textToShow}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full relative">
      
      {/* Empty state: Watermark branding */}
      {chatMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden bg-slate-50/40 dark:bg-[#0F172A]/40">
          
          {/* Company Name and Tagline */}
          <div className="z-10 flex flex-col items-center gap-4 bg-white/70 dark:bg-slate-900/75 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl backdrop-blur-md max-w-lg mx-auto">
            <div>
              <h2 className="text-4xl font-black text-[#1E88E5] dark:text-white tracking-tight">{t.welcomeName}</h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest">
                {t.welcomeSubtitle}
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 gap-2.5 w-full mt-4">
              {[
                t.sugMalaria,
                t.sugAyushman,
                t.sugFever
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-[#1E88E5] dark:hover:border-blue-505 text-xs text-slate-650 dark:text-slate-350 hover:text-[#1E88E5] dark:hover:text-blue-400 font-semibold cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Thread view: scrollable stream of messages */
        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-6 no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-full ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role !== "user" && (
                  <div className="h-8.5 w-8.5 rounded-full bg-blue-600 dark:bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    HX
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {msg.role === "user" ? (
                    <div className="px-4.5 py-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs bg-blue-600 dark:bg-[#3B82F6] text-white dark:text-[#F9FAFB] rounded-tr-none">
                      {msg.content}
                    </div>
                  ) : (
                    renderModelMessage(msg)
                  )}
                  {msg.role === "model" && (
                    <div className="flex items-center gap-1.5 mt-1.5 px-1 bg-slate-50 dark:bg-slate-800/40 rounded-lg py-1 px-2 border border-slate-100 dark:border-slate-800">
                      {isPlayingVoice === msg.id ? (
                        <>
                          {isPausedVoice ? (
                            <button
                              type="button"
                              onClick={resumeVoice}
                              className="p-1 text-slate-500 hover:text-blue-500 rounded-md transition cursor-pointer"
                              title="Resume Voice"
                            >
                              <Play className="h-3 w-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={pauseVoice}
                              className="p-1 text-slate-500 hover:text-blue-500 rounded-md transition cursor-pointer"
                              title="Pause Voice"
                            >
                              <Pause className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={stopVoice}
                            className="p-1 text-slate-500 hover:text-red-500 rounded-md transition cursor-pointer"
                            title="Stop Voice"
                          >
                            <Square className="h-3 w-3 fill-slate-500" />
                          </button>
                          <span className="text-[9px] text-blue-500 font-bold animate-pulse">Playing audio...</span>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => speakText(msg.content, msg.id, currentLang)}
                          className="p-1 text-slate-400 hover:text-blue-500 rounded-md transition flex items-center gap-1 cursor-pointer"
                          title="Speak Answer"
                        >
                          <Volume2 className="h-3 w-3" />
                          <span className="text-[9px] font-bold">Listen</span>
                        </button>
                      )}
                    </div>
                  )}
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="h-8.5 w-8.5 rounded-full bg-slate-200 dark:bg-[#1F2937] text-slate-700 dark:text-[#F9FAFB] flex items-center justify-center font-bold text-xs shrink-0">
                    {getInitials(userProfile.name)}
                  </div>
                )}
              </div>
            ))}
            
            {/* Floating typing loader */}
            {isChatLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8.5 w-8.5 rounded-full bg-[#1E88E5] dark:bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                  HX
                </div>
                <div className="bg-white dark:bg-[#1F2937] border border-slate-200/60 dark:border-[#374151] px-5 py-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-3">
                  <span className="flex gap-1">
                    <span className="h-2 w-2 bg-[#1E88E5] dark:bg-[#3B82F6] rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-[#1E88E5] dark:bg-[#3B82F6] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 bg-[#1E88E5] dark:bg-[#3B82F6] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t.processingClinicalFacts}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Fixed bottom Query Input Area */}
      <div className="px-4 py-6 bg-gradient-to-t from-[#F8FAFC] dark:from-[#0F172A] via-[#F8FAFC]/95 dark:via-[#0F172A]/95 to-transparent shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendChatMessage} className="relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage(e);
                }
              }}
              placeholder={t.askAssistant}
              rows={1}
              className="w-full bg-white dark:bg-[#1F2937] text-slate-900 dark:text-[#F9FAFB] border border-slate-200 dark:border-[#374151] rounded-[24px] pl-5 pr-24 py-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] dark:focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-md hover:shadow-lg placeholder-slate-400/80 dark:placeholder-slate-500 resize-none max-h-48 min-h-[56px] leading-relaxed"
              disabled={isChatLoading}
            />
            <button
              type="button"
              onClick={isListeningInput ? stopSpeechRecognition : startSpeechRecognition}
              className={`absolute right-14 top-2.5 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
                isListeningInput
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-550 dark:text-slate-300"
              }`}
              title={isListeningInput ? "Stop Listening" : "Speak to Assistant"}
            >
              {isListeningInput ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="absolute right-3 top-2.5 h-10 w-10 bg-[#1E88E5] dark:bg-[#3B82F6] hover:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-650 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {t.disclaimerText}
          </p>
        </div>
      </div>

    </div>
  );
}
