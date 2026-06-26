import React, { FormEvent } from "react";
import { BookOpen, ShieldCheck, ExternalLink, CheckCircle } from "lucide-react";
import { TranslationSet } from "../translations";

interface SchemeDetail {
  id?: string;
  title: string;
  description: string;
  url?: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  steps: string[];
}

interface GovtSchemesProps {
  t: TranslationSet;
  eligAge: string;
  setEligAge: (s: string) => void;
  eligIncome: string;
  setEligIncome: (s: string) => void;
  eligArea: "Rural" | "Urban";
  setEligArea: (s: "Rural" | "Urban") => void;
  eligibilityResult: any[] | null;
  handleCheckEligibility: (e: FormEvent) => void;
  selectedScheme: string;
  setSelectedScheme: (s: string) => void;
  schemesData: {
    pmjay: SchemeDetail;
    abha: SchemeDetail;
    stateSchemes: SchemeDetail;
  };
}

export default function GovtSchemes({
  t,
  eligAge,
  setEligAge,
  eligIncome,
  setEligIncome,
  eligArea,
  setEligArea,
  eligibilityResult,
  handleCheckEligibility,
  selectedScheme,
  setSelectedScheme,
  schemesData
}: GovtSchemesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-5">
          <h3 className="font-extrabold text-xl text-[#0F172A] dark:text-white flex items-center gap-2">
            <BookOpen className="h-5.5 w-5.5 text-blue-600" />
            <span>{t.govtSchemeGuide}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.govtSchemeSubtitle}</p>
        </div>

        {/* 🏥 SMART ELIGIBILITY CHECKER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:shadow-sm transition">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{t.eligibilityTitle}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.eligibilitySubtitle}</p>
          </div>
          
          <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.ageLabel}</label>
              <input
                type="number"
                value={eligAge}
                onChange={(e) => setEligAge(e.target.value)}
                placeholder="e.g. 42"
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.incomeLabel}</label>
              <input
                type="number"
                value={eligIncome}
                onChange={(e) => setEligIncome(e.target.value)}
                placeholder="e.g. 180000"
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.areaLabel}</label>
              <select
                value={eligArea}
                onChange={(e) => setEligArea(e.target.value as "Rural" | "Urban")}
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-hidden"
              >
                <option value="Rural">Rural Area</option>
                <option value="Urban">Urban Area</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex justify-center items-center gap-1.5 h-10 border-none"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t.checkEligibilityBtn}</span>
            </button>
          </form>

          {/* Eligibility results */}
          {eligibilityResult && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.resultEligible}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eligibilityResult.length === 0 ? (
                  <p className="text-xs text-slate-500">{t.resultNotEligible}</p>
                ) : (
                  eligibilityResult.map((sch, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-850/40 border border-slate-150 dark:border-slate-805 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                      <div className="space-y-1.5 mb-3">
                        <span className="absolute top-2 right-2 text-[8px] font-black bg-blue-50 text-blue-650 px-2 py-0.5 rounded uppercase tracking-wider">{sch.badge}</span>
                        <h5 className="font-bold text-xs text-slate-800 dark:text-white pr-16">{sch.title}</h5>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal font-light">{sch.desc}</p>
                      </div>
                      <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        {sch.url && (
                          <a
                            href={sch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedScheme(sch.id);
                            setTimeout(() => {
                              document.getElementById("scheme-detail-box")?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border-none"
                        >
                          <span>View Guide</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scheme Selector Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setSelectedScheme("pmjay")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border-none ${
              selectedScheme === "pmjay"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-transparent"
            }`}
          >
            {t.pmjayTitle}
          </button>
          <button
            onClick={() => setSelectedScheme("abha")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border-none ${
              selectedScheme === "abha"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-transparent"
            }`}
          >
            {t.abhaTitle}
          </button>
          <button
            onClick={() => setSelectedScheme("stateSchemes")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border-none ${
              selectedScheme === "stateSchemes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-transparent"
            }`}
          >
            {t.statePlansTitle}
          </button>
        </div>

        {/* Detail Information Box */}
        <div id="scheme-detail-box" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 hover:shadow-sm transition">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {t.selectedPlanProfile}
              </span>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-base mt-1">{schemesData[selectedScheme as keyof typeof schemesData]?.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">{schemesData[selectedScheme as keyof typeof schemesData]?.description}</p>
            </div>
            {schemesData[selectedScheme as keyof typeof schemesData]?.url && (
              <a
                href={schemesData[selectedScheme as keyof typeof schemesData]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer shrink-0 mt-2 sm:mt-0"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Benefits Coverage List */}
            <div className="bg-slate-50 dark:bg-slate-850 p-4.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">{t.corePolicyBenefits}</h5>
              <ul className="space-y-3 pl-0 list-none">
                {schemesData[selectedScheme as keyof typeof schemesData]?.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-normal font-light">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {/* Eligibility Conditions */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h5 className="font-bold text-xs text-slate-705 dark:text-slate-200 uppercase tracking-wider mb-2">{t.whoIsEligible}</h5>
                <ul className="list-disc pl-4.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {schemesData[selectedScheme as keyof typeof schemesData]?.eligibility.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>

              {/* Required Documents list */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">{t.requiredDocs}</h5>
                <div className="flex flex-wrap gap-1.5">
                  {schemesData[selectedScheme as keyof typeof schemesData]?.documents.map((doc, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Steps block */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">{t.applicationWorkflow}</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schemesData[selectedScheme as keyof typeof schemesData]?.steps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 p-4 rounded-xl">
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5 font-light">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
