import React from "react";
import { 
  MessageSquare, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  User, 
  BookOpen, 
  Trash2, 
  Plus, 
  Star, 
  Check, 
  Send, 
  LogOut, 
  PanelLeft, 
  PanelLeftClose, 
  ChevronRight, 
  ChevronLeft,
  Phone
} from "lucide-react";
import { UserSession } from "../../types";
import { TranslationSet } from "../translations";

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: any[];
}

interface SidebarProps {
  userProfile: UserSession;
  currentLang: string;
  t: TranslationSet;
  activeTab: "chat" | "report-saver" | "schemes" | "resources" | "misinformation" | "profile" | "whatsapp-bot";
  isSidebarOpen: boolean;
  setIsSidebarOpen: (b: boolean) => void;
  isSidebarMinimized: boolean;
  setIsSidebarMinimized: (b: boolean) => void;
  isFeaturesMinimized: boolean;
  setIsFeaturesMinimized: (b: boolean) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  handleNewChat: () => void;
  handleSelectSession: (id: string) => void;
  handleDeleteSession: (e: React.MouseEvent, id: string) => void;
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (b: boolean) => void;
  hasSubmittedFeedback: boolean;
  userFeedback: { rating: number; comment: string } | null;
  feedbackRating: number;
  setFeedbackRating: (n: number) => void;
  feedbackComment: string;
  setFeedbackComment: (s: string) => void;
  handleFeedbackSubmit: (e: React.FormEvent) => void;
  onLogout: () => void;
  handleToggleMinimize: () => void;
  navigateTab: (tab: string) => void;
}

export default function Sidebar({
  userProfile,
  t,
  activeTab,
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarMinimized,
  isFeaturesMinimized,
  setIsFeaturesMinimized,
  sessions,
  activeSessionId,
  handleNewChat,
  handleSelectSession,
  handleDeleteSession,
  isFeedbackOpen,
  setIsFeedbackOpen,
  hasSubmittedFeedback,
  userFeedback,
  feedbackRating,
  setFeedbackRating,
  feedbackComment,
  setFeedbackComment,
  handleFeedbackSubmit,
  onLogout,
  handleToggleMinimize,
  navigateTab
}: SidebarProps) {
  // Helper to generate name initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div 
        className={`bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-[#374151] flex flex-col h-screen fixed md:relative z-40 transition-all duration-300 ease-in-out shadow-lg shadow-slate-100 dark:shadow-none ${
          isSidebarOpen 
            ? isSidebarMinimized 
              ? "w-20 translate-x-0" 
              : "w-72 translate-x-0" 
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        } ${isSidebarMinimized ? "md:w-20" : "md:w-72"}`}
      >
        {/* Healix Sidebar Branding Header */}
        <div className="p-4 border-b border-slate-100 dark:border-[#374151] shrink-0 flex items-center justify-between bg-slate-50/50 dark:bg-[#111827]">
          {isSidebarMinimized ? (
            <button 
              onClick={handleToggleMinimize}
              className="mx-auto p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2937] text-slate-400 hover:text-[#1E88E5] dark:hover:text-[#3B82F6] transition shrink-0 cursor-pointer" 
              title="Expand Sidebar"
            >
              <PanelLeft className="h-4.5 w-4.5" />
            </button>
          ) : (
            <div className="flex flex-col select-none px-1">
              <span className="text-lg font-black text-[#1E88E5] dark:text-white tracking-tight leading-none">{t.appTitle}</span>
              <span className="text-[8px] text-[#64748B] dark:text-[#9CA3AF] font-bold mt-0.5 uppercase tracking-wider">{t.aiAssistant}</span>
            </div>
          )}
          
          {!isSidebarMinimized && (
            <button 
              onClick={handleToggleMinimize}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2937] text-slate-400 hover:text-blue-600 dark:hover:text-[#3B82F6] transition shrink-0 cursor-pointer" 
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Profile Section (Top, ChatGPT-style) */}
        <div className="p-4 border-b border-slate-100 dark:border-[#374151] shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-[#1E88E5] dark:bg-[#3B82F6] flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-[#1E88E5]/20">
              {getInitials(userProfile.name)}
            </div>
            {!isSidebarMinimized && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-[#F9FAFB] truncate leading-snug">{userProfile.name}</p>
                <p className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] font-medium truncate mt-0.5">{userProfile.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Middle Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
          
          {/* Features Section */}
          <div className="space-y-1">
            {!isSidebarMinimized ? (
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 px-3 mb-2 flex items-center justify-between">
                <span>{t.features}</span>
                <button
                  onClick={() => setIsFeaturesMinimized(!isFeaturesMinimized)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1F2937] cursor-pointer"
                  title={isFeaturesMinimized ? "Expand Features" : "Minimize Features"}
                >
                  {isFeaturesMinimized ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center text-[10px] uppercase font-bold text-slate-400 mb-2">
                Apps
              </div>
            )}

            {isFeaturesMinimized && !isSidebarMinimized ? (
              <div className="grid grid-cols-7 gap-1 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {/* 💬 Chat Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "chat" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.aiAssistant}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                </button>

                {/* 📍 Nearby Healthcare Resources Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/resources");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "resources" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.nearbyResources}
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                </button>

                {/* 🏥 Government Health Schemes Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/schemes");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "schemes" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.governmentSchemes}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                </button>

                {/* 🛡️ Misinformation Detector Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/misinformation");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "misinformation" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.misinfoDetector}
                >
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                </button>

                {/* 📄 Report Saver Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/reports");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "report-saver" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.reportSaver}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                </button>

                {/* 📞 WhatsApp Bot Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/whatsapp");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "whatsapp-bot" 
                      ? "bg-emerald-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.whatsappBot}
                >
                  <Phone className="h-4 w-4 shrink-0" />
                </button>

                {/* ⚙️ Profile & Settings Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/profile");
                    setIsSidebarOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition cursor-pointer ${
                    activeTab === "profile" 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-100 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.profileSettings}
                >
                  <User className="h-4 w-4 shrink-0" />
                </button>
              </div>
            ) : (
              <>
                {/* 💬 Chat Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "chat" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.aiAssistant}
                >
                  <MessageSquare className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.aiAssistant}</span>}
                </button>

                {/* 📍 Nearby Healthcare Resources Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/resources");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "resources" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.nearbyResources}
                >
                  <MapPin className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.nearbyResources}</span>}
                </button>

                {/* 🏥 Government Health Schemes Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/schemes");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "schemes" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.governmentSchemes}
                >
                  <BookOpen className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.governmentSchemes}</span>}
                </button>

                {/* 🛡️ Misinformation Detector Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/misinformation");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "misinformation" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.misinfoDetector}
                >
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.misinfoDetector}</span>}
                </button>

                {/* 📄 Report Saver Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/reports");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "report-saver" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.reportSaver}
                >
                  <FileText className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.reportSaver}</span>}
                </button>

                {/* 📞 WhatsApp Bot Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/whatsapp");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "whatsapp-bot" 
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-600 dark:border-emerald-400" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.whatsappBot}
                >
                  <Phone className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.whatsappBot}</span>}
                </button>

                {/* ⚙️ Profile & Settings Option */}
                <button
                  onClick={() => {
                    navigateTab("/portal/profile");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left rounded-xl flex items-center gap-3 transition font-semibold text-xs cursor-pointer ${
                    isSidebarMinimized ? "justify-center p-3" : "px-3.5 py-3"
                  } ${
                    activeTab === "profile" 
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] border-l-4 border-blue-600 dark:border-[#3B82F6]" 
                      : "text-slate-600 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937] hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                  }`}
                  title={t.profileSettings}
                >
                  <User className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarMinimized && <span className="truncate">{t.profileSettings}</span>}
                </button>
              </>
            )}
          </div>

          {/* Recent History Section */}
          <div className="space-y-1">
            {!isSidebarMinimized ? (
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 px-3 mb-2 flex justify-between items-center">
                <span>{t.recentHistory}</span>
                <button 
                  onClick={handleNewChat}
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> {t.newChat}
                </button>
              </div>
            ) : (
              <div className="text-center text-[10px] uppercase font-bold text-slate-400 mb-2" title={t.recentHistory}>
                Chats
              </div>
            )}

            {/* Independent Scrollable Conversations List */}
            <div className="space-y-1 overflow-y-auto max-h-[350px] no-scrollbar">
              {sessions.length === 0 ? (
                !isSidebarMinimized && (
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 italic px-3 py-2">{t.noConversations}</p>
                )
              ) : (
                sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => handleSelectSession(sess.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectSession(sess.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`w-full text-left rounded-xl flex items-center justify-between gap-2 transition text-xs font-medium cursor-pointer ${
                      isSidebarMinimized ? "justify-center p-3" : "px-3 py-2.5"
                    } ${
                      activeSessionId === sess.id && activeTab === "chat"
                        ? "bg-slate-100/80 dark:bg-[#1F2937] text-slate-900 dark:text-[#F9FAFB] border-l-2 border-slate-400 dark:border-[#3B82F6]" 
                        : "text-slate-500 dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#1F2937]/50 hover:text-slate-800 dark:hover:text-[#F9FAFB]"
                    }`}
                    title={sess.title}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MessageSquare className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-550" />
                      {!isSidebarMinimized && (
                        <div className="flex flex-col text-left min-w-0">
                          <span className="truncate font-semibold text-slate-700 dark:text-[#F9FAFB]">{sess.title}</span>
                          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">{sess.timestamp}</span>
                        </div>
                      )}
                    </div>
                    
                    {!isSidebarMinimized && (
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="p-1 rounded-md text-slate-350 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-[#1F2937] transition cursor-pointer"
                        title="Delete Chat"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))
              )}

              {/* Minimized shortcut button */}
              {isSidebarMinimized && (
                <button
                  onClick={handleNewChat}
                  className="w-10 h-10 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-[#3B82F6] flex items-center justify-center transition hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer mt-2"
                  title="New Conversation"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions Section */}
        <div className="p-3 border-t border-slate-100 dark:border-[#374151] bg-slate-50/50 dark:bg-[#111827] shrink-0">
          <div className="flex flex-col gap-3">
            {/* 💬 Inline Feedback inside Sidebar */}
            {isSidebarMinimized ? (
              <button 
                onClick={() => handleToggleMinimize()}
                className="w-full rounded-xl text-slate-500 dark:text-[#9CA3AF] hover:text-[#1E88E5] dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-[#1F2937]/50 transition text-xs font-semibold flex items-center justify-center p-3 cursor-pointer"
                title="Share Feedback (Expand Sidebar)"
              >
                <MessageSquare className="h-4.5 w-4.5 shrink-0" />
              </button>
            ) : (
              <div className="px-1.5 space-y-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-1">
                <div 
                  onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                  className="flex items-center justify-between text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-[#1F2937]/50 p-1.5 rounded-lg transition"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{t.shareFeedback}</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isFeedbackOpen ? "rotate-90" : ""}`} />
                </div>
                
                {isFeedbackOpen && (
                  <div className="animate-fade-in mt-1">
                    {hasSubmittedFeedback ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-800/30 rounded-xl p-3 text-xs text-center space-y-2 animate-scale-in">
                        <div className="mx-auto h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Check className="h-4.5 w-4.5 stroke-[2.5]" />
                        </div>
                        <p className="font-extrabold text-emerald-800 dark:text-emerald-400">
                          {t.feedbackSaved}
                        </p>
                        {userFeedback && (
                          <div className="space-y-1 bg-white/50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/50 text-left">
                            <div className="flex gap-0.5 text-amber-400">
                              {Array.from({ length: userFeedback.rating }).map((_, i) => (
                                <span key={i} className="text-[10px]">★</span>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-light italic leading-relaxed">
                              "{userFeedback.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2.5 bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl p-2.5 shadow-xs">
                        <div className="flex justify-between items-center px-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackRating(star)}
                                className="p-0.5 cursor-pointer transition-transform hover:scale-120 duration-150"
                              >
                                <Star 
                                  className={`h-4 w-4 ${
                                    star <= feedbackRating 
                                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]" 
                                      : "text-slate-300 dark:text-slate-700"
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {feedbackRating === 5 && "😄 Great!"}
                            {feedbackRating === 4 && "🙂 Good!"}
                            {feedbackRating === 3 && "😐 OK"}
                            {feedbackRating === 2 && "🙁 Bad"}
                            {feedbackRating === 1 && "😢 Awful"}
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          <textarea
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder={t.tellThoughts}
                            rows={2}
                            className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none font-light leading-normal"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (feedbackComment.trim()) {
                                const event = { preventDefault: () => {} } as React.FormEvent;
                                handleFeedbackSubmit(event);
                              }
                            }}
                            disabled={!feedbackComment.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-1.5 rounded-lg text-[10px] cursor-pointer transition duration-150 flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Send className="h-3 w-3" />
                            <span>Submit Feedback</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Logout Action */}
            <button 
              onClick={onLogout}
              className={`w-full rounded-xl text-slate-500 dark:text-[#9CA3AF] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${
                isSidebarMinimized ? "justify-center p-3" : "px-3 py-2.5"
              }`}
              title={t.logout}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isSidebarMinimized && <span>{t.logout}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar overlay shield */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/65 backdrop-blur-xs z-30 md:hidden animate-fade-in"
        />
      )}
    </>
  );
}
