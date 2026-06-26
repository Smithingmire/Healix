import React, { FormEvent, RefObject } from "react";
import { Send, Mic, MicOff, Volume2, Play, Pause, Square } from "lucide-react";
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
  cleanChatSymbols
}: ChatAssistantProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
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
                  <div
                    className={`px-4.5 py-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.role === "user"
                        ? "bg-blue-600 dark:bg-[#3B82F6] text-white dark:text-[#F9FAFB] rounded-tr-none"
                        : "bg-white dark:bg-[#1F2937] text-slate-800 dark:text-[#F9FAFB] rounded-tl-none border border-slate-200/60 dark:border-[#374151]"
                    }`}
                  >
                    {msg.role === "model" ? cleanChatSymbols(msg.content) : msg.content}
                  </div>
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
