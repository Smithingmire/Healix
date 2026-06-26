import React, { ChangeEvent, FormEvent } from "react";
import { FileText, Plus, X, Upload, Trash2, Download } from "lucide-react";
import { TranslationSet } from "../translations";

interface MedicalReport {
  id: string;
  title: string;
  date: string;
  doctorOrLab: string;
  summary: string;
}

interface ReportSaverProps {
  t: TranslationSet;
  showAddReport: boolean;
  setShowAddReport: (b: boolean) => void;
  reportTitle: string;
  setReportTitle: (s: string) => void;
  reportRealFileName: string;
  setReportRealFileName: (s: string) => void;
  setReportFileContent: (c: string | null) => void;
  medicalReports: MedicalReport[];
  handleAddReportSubmit: (e: FormEvent) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteReport: (id: string) => void;
}

export default function ReportSaver({
  t,
  showAddReport,
  setShowAddReport,
  reportTitle,
  setReportTitle,
  reportRealFileName,
  setReportRealFileName,
  setReportFileContent,
  medicalReports,
  handleAddReportSubmit,
  handleFileChange,
  handleDeleteReport
}: ReportSaverProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-5">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5.5 w-5.5 text-blue-600 dark:text-blue-550" />
              <span>{t.reportSaver}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
              {t.reportSaverSubtitle}
            </p>
          </div>
          
          {/* Plus Icon Trigger Button */}
          <button
            onClick={() => {
              setReportTitle("");
              setReportRealFileName("");
              setReportFileContent(null);
              setShowAddReport(!showAddReport);
            }}
            className="p-3 bg-blue-600 hover:bg-blue-755 text-white rounded-full transition shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer border-none"
            title={t.uploadDocument}
          >
            {showAddReport ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>

        {/* Upload Form Modal/Card */}
        {showAddReport && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{t.uploadDocument}</h3>
            <form onSubmit={handleAddReportSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.docTitle}
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Blood Test Report, Dental Prescription"
                  required
                  className="w-full bg-slate-55 dark:bg-slate-80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  {t.selectDocFile}
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center cursor-pointer relative hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {reportRealFileName ? `Selected: ${reportRealFileName}` : t.clickToSelect}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{t.fileConstraints}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReport(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!reportTitle.trim() || !reportRealFileName}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md border-none"
                >
                  {t.saveReport}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {t.savedLedger}
          </h3>
          
          {medicalReports.length === 0 ? (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center bg-slate-50/20 dark:bg-slate-900/10">
              <FileText className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.noDocsSaved}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {t.clickPlusToStore}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medicalReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-blue-150 dark:hover:border-blue-900/60 transition duration-200 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0 flex items-start gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs truncate">
                        {report.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {report.date}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate mt-1">
                        File: {report.doctorOrLab}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    {report.summary && (
                      <a
                        href={report.summary}
                        download={report.doctorOrLab}
                        className="p-1.5 text-slate-400 hover:text-[#1E88E5] dark:hover:text-blue-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        title="Download File"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1F2937] transition cursor-pointer border-none bg-transparent"
                      title="Delete Report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
