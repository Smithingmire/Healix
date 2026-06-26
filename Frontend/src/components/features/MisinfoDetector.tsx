import React from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, BookOpen, ExternalLink, Clock, Trash2 } from "lucide-react";
import { TranslationSet } from "../translations";

interface MisinfoResult {
  credibilityStatus: "Verified" | "Partially Accurate" | "Misleading" | "Unverified" | string;
  dangerous: boolean;
  evidenceExplanation: string;
  correctInfo: string;
  recommendation: string;
  sources?: any[];
}

interface HistoryItem {
  claim: string;
  result: MisinfoResult;
  timestamp: string;
}

interface MisinfoDetectorProps {
  t: TranslationSet;
  currentLang: string;
  misinfoClaim: string;
  setMisinfoClaim: (s: string) => void;
  isMisinfoLoading: boolean;
  misinfoResult: MisinfoResult | null;
  setMisinfoResult: (res: MisinfoResult | null) => void;
  handleMisinfoScan: (claimText: string) => void;
  misinfoHistory: HistoryItem[];
  setMisinfoHistory: (history: HistoryItem[]) => void;
}

export default function MisinfoDetector({
  t,
  currentLang,
  misinfoClaim,
  setMisinfoClaim,
  isMisinfoLoading,
  misinfoResult,
  setMisinfoResult,
  handleMisinfoScan,
  misinfoHistory,
  setMisinfoHistory
}: MisinfoDetectorProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in h-full bg-slate-55/40 dark:bg-[#0B0F19]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <h3 className="font-extrabold text-xl text-[#0F172A] dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5.5 w-5.5 text-red-500" />
            <span>{t.detectorTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.detectorSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Input + Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* presets to click */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Example claims (Click to test)</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: currentLang === "hi" ? "गर्म पानी पीने से कोरोना ठीक होता है" : "Drinking hot water completely cures COVID-19", icon: "🔥" },
                  { text: currentLang === "hi" ? "लहसुन खाने से कैंसर का इलाज संभव है" : "Eating garlic cures cancer in 3 weeks", icon: "🧄" },
                  { text: currentLang === "hi" ? "डेंगू बुखार होने पर पपीते के पत्ते प्लेटलेट्स बढ़ाते हैं" : "Papaya leaves extract boosts blood platelets in Dengue", icon: "🍃" }
                ].map((pre, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setMisinfoClaim(pre.text);
                      handleMisinfoScan(pre.text);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-650 dark:text-slate-350 flex items-center gap-2 cursor-pointer transition"
                  >
                    <span>{pre.icon}</span>
                    <span className="truncate max-w-[250px]">{pre.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <input
                type="text"
                value={misinfoClaim}
                onChange={(e) => setMisinfoClaim(e.target.value)}
                placeholder={t.enterClaim}
                className="w-full text-xs px-4 py-3.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800 dark:text-white transition-all shadow-inner"
              />
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleMisinfoScan(misinfoClaim)}
                  disabled={isMisinfoLoading || !misinfoClaim.trim()}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-850 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs border-none"
                >
                  {isMisinfoLoading ? (
                    <>
                      <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t.analyzeBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scanner Result output card */}
            {misinfoResult && (
              <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-3xl p-6 space-y-5 animate-fade-in shadow-md">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{t.claimAnalysis}</span>
                    <h4 className="font-extrabold text-slate-808 dark:text-white text-sm mt-1">{misinfoClaim.slice(0, 60)}...</h4>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t.credibilityStatus}:</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                      misinfoResult.credibilityStatus === "Verified" ? "bg-green-50 border-green-200 text-green-700" :
                      misinfoResult.credibilityStatus === "Partially Accurate" ? "bg-amber-50 border-amber-200 text-amber-700" :
                      misinfoResult.credibilityStatus === "Misleading" ? "bg-red-50 border-red-200 text-red-700" :
                      "bg-slate-50 border-slate-200 text-slate-700"
                    }`}>
                      {misinfoResult.credibilityStatus === "Verified" && "🟢 "}
                      {misinfoResult.credibilityStatus === "Partially Accurate" && "🟡 "}
                      {misinfoResult.credibilityStatus === "Misleading" && "🔴 "}
                      {misinfoResult.credibilityStatus === "Unverified" && "⚫ "}
                      {misinfoResult.credibilityStatus}
                    </span>
                  </div>
                </div>

                {misinfoResult.dangerous && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-500 animate-bounce" />
                    <span>{t.dangerWarning}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-50/50 dark:bg-slate-850/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.evidenceExplanation}</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-light">{misinfoResult.evidenceExplanation}</p>
                  </div>
                  
                  <div className="bg-slate-50/50 dark:bg-slate-850/40 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.correctInfo}</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-light">{misinfoResult.correctInfo}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.recommendation}</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-350 mt-1 font-light leading-relaxed">{misinfoResult.recommendation}</p>
                  </div>
                </div>

                {misinfoResult.sources && misinfoResult.sources.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                      <span>Sources & References</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {misinfoResult.sources.map((src: any, idx: number) => {
                        const name = typeof src === "object" && src !== null ? src.name : src;
                        const url = typeof src === "object" && src !== null ? src.url : null;
                        if (url) {
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-105 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>{name}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          );
                        }
                        return (
                          <span key={idx} className="px-2.5 py-1 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 rounded-lg text-[10px] font-bold">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Scan History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Scan History</span>
                </h4>
                {misinfoHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMisinfoHistory([]);
                      localStorage.removeItem("healix_misinfo_history");
                    }}
                    className="text-[10px] text-red-500 hover:text-red-750 dark:hover:text-red-400 font-bold transition flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {misinfoHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 space-y-2">
                  <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700 stroke-1" />
                  <p className="text-xs italic">No recent scans.</p>
                  <p className="text-[10px] leading-normal px-4">Claims you analyze will appear here for quick access.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1 no-scrollbar">
                  {misinfoHistory.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMisinfoClaim(item.claim);
                        setMisinfoResult(item.result);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-2 cursor-pointer ${
                        misinfoClaim === item.claim
                          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                          : "bg-slate-50/50 dark:bg-slate-850/30 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">
                          {item.claim}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 shrink-0 font-medium mt-0.5">
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          item.result.credibilityStatus === "Verified" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-400" :
                          item.result.credibilityStatus === "Partially Accurate" ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400" :
                          item.result.credibilityStatus === "Misleading" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400" :
                          "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350"
                        }`}>
                          {item.result.credibilityStatus}
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                          View &rarr;
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
