import React, { useState, useRef, useEffect } from "react";
import { Message, Stadium } from "../types";
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Sparkles, 
  AlertCircle,
  Clock,
  Languages,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatbotProps {
  selectedStadium: Stadium;
}

export default function Chatbot({ selectedStadium }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: `Hello! I am **StadiumGPT**, your dedicated AI Assistant for the FIFA World Cup 2026. 

I'm configured for **${selectedStadium.name}**. I can guide you through:
- 🎫 Gate locations & current line queue wait times
- 🚇 Train, shuttle buses, and EV parking locations
- ♿ Accessibility accommodations & wheelchair services
- 🍔 Sustainability initiatives and zero-waste dining options

How can I assist you in the stadium today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Prepopulated Quick-Access Commands based on selected Stadium
  const SUGGESTED_PROMPTS = [
    `How long is the wait at ${selectedStadium.gates[0]?.name || "Gate A"}?`,
    "What is the most sustainable way to travel to the venue?",
    "Where is wheelchair-accessible entry located?",
    "Show me upcoming match list and times here.",
    "Is there an emergency medical help spot near me?"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Clean up any ongoing speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input.trim();
    if (!prompt) return;

    if (!textToSend) {
      setInput("");
    }
    setErrorMsg(null);

    // Stop speaking if new question is asked
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechId(null);
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedStadium: selectedStadium.name,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Gemini Server responded with an error.");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply || "I didn't receive a response from the AI. Let's try again.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect with StadiumGPT. Please check your Gemini API key in Settings > Secrets or retry.");
      
      // Add a helpful fallback message for demo safety
      const fallbackMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: `⚠️ **Demo Assistant Mode:** I'm having trouble connecting to the live Gemini API right now. Let me provide some local assistance:

At **${selectedStadium.name}**, here are the current conditions:
- **Transit Hubs:** ${selectedStadium.transitHubs.map(t => `${t.name} (${t.status})`).join(", ")}
- **Entry Gates:** ${selectedStadium.gates.map(g => `${g.name} (Wait: ${g.waitMinutes}m)`).join(", ")}

Please ensure your \`GEMINI_API_KEY\` is configured in AI Studio Secrets if you want to use live AI reasoning!`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speaks assistant text using Browser TTS
  const toggleSpeech = (msgId: string, text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (activeSpeechId === msgId && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any other speech
    
    // Clean text of markdown characters
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/- /g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechId(null);
    };

    setIsSpeaking(true);
    setActiveSpeechId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="chatbot-container">
      {/* Side panel for presets and commands */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4" id="ai-info-sidebar">
          <div className="flex items-center gap-2 text-brand-gold font-bold font-display text-sm border-b border-white/10 pb-3">
            <Sparkles className="w-4 h-4" /> Live Venue Profile
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-400 uppercase tracking-widest block">Active Stadium</span>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-slate-100 text-sm block">{selectedStadium.name}</span>
              <span className="text-xs text-slate-400 block">{selectedStadium.location}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-green animate-pulse" /> Stadium Gate Queues
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selectedStadium.gates.map((g, index) => (
                <div key={index} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-slate-300 truncate max-w-[120px]">{g.name.split(" ")[0]} {g.name.split(" ")[1] || ""}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    g.waitMinutes > 25 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                  }`}>
                    {g.waitMinutes}m wait
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 flex flex-col h-[650px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl" id="chat-box">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-blue/20 via-slate-950 to-brand-green/10 border-b border-white/10 flex justify-between items-center" id="chat-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-green to-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/10">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide text-sm md:text-base font-display">StadiumGPT Assistant</h2>
              <p className="text-[10px] text-brand-green font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping inline-block" /> Gemini 3.5 AI Core Live
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg border border-white/10">
            <Languages className="w-4 h-4 text-brand-gold" /> Multilingual Support
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" id="chat-messages-thread">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isAi = m.role === "assistant";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-4/5 ${isAi ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isAi ? "bg-brand-blue/20 border border-brand-blue/35 text-brand-blue" : "bg-brand-green/20 border border-brand-green/35 text-brand-green"
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-1">
                    <div className={`rounded-2xl p-4 border text-sm leading-relaxed whitespace-pre-wrap ${
                      isAi 
                        ? "bg-white/5 border-white/10 text-slate-200" 
                        : "bg-brand-green/15 border-brand-green/30 text-emerald-100"
                    }`}>
                      {m.content}
                    </div>

                    {/* Audio Toggle & Timestamp */}
                    <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isAi ? "justify-start" : "justify-end"}`}>
                      <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isAi && (
                        <button
                          onClick={() => toggleSpeech(m.id, m.content)}
                          className="p-1 hover:text-brand-gold transition"
                          title="Speak answer aloud"
                        >
                          {activeSpeechId === m.id && isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 self-start" id="chat-loading-indicator">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/35 text-brand-blue flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-400 font-mono italic">StadiumGPT is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts Row */}
        <div className="px-6 py-2.5 bg-[#020617]/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none" id="suggestions-row">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              id={`preset-prompt-${idx}`}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-[#020617]/95 border-t border-white/10" id="chat-input-container">
          <div className="relative flex items-center">
            <input
              type="text"
              id="input-chat-query"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask StadiumGPT about ${selectedStadium.name}...`}
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all disabled:opacity-50"
            />
            <button
              id="btn-send-query"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-brand-gold hover:bg-[#b08e4d] text-slate-950 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
