import React, { useState } from "react";
import { Stadium } from "../types";
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle, 
  Send, 
  Users, 
  AlertOctagon,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AccessibilityAssistantProps {
  selectedStadium: Stadium;
  fontSizeClass: string;
  setFontSizeClass: (s: string) => void;
}

interface AssistRequest {
  id: string;
  section: string;
  serviceType: string;
  status: "Received" | "Usher Dispatched" | "Arrived";
}

export default function AccessibilityAssistant({ 
  selectedStadium,
  fontSizeClass,
  setFontSizeClass
}: AccessibilityAssistantProps) {
  // Usher request states
  const [section, setSection] = useState("");
  const [serviceType, setServiceType] = useState("Wheelchair Escort");
  const [requests, setRequests] = useState<AssistRequest[]>([
    { id: "REQ-401", section: "Section 104, Row K", serviceType: "Sensory Ear Defenders", status: "Usher Dispatched" }
  ]);

  // Audio describer audio cues
  const [audioCueText, setAudioCueText] = useState("Select a deck above to read its layout description.");
  
  // Emergency panic state
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Audio description presets
  const DECK_DESCRIPTIONS: Record<string, string> = {
    lower: `Lower Seating Deck at ${selectedStadium.name}. Level 1 exits are step-free. Accessibility platforms are located behind Sections 105, 114, and 124. Elevated restrooms are located near Gate A and Gate D.`,
    club: `Premium Club Suite Level. Elevator access is available next to the Press Entry Gate. All corridors feature tactile ground indicators and high-contrast signage. Elevators feature braille selectors.`,
    upper: `Upper Tier Deck. Ramps are located next to Gate B. Level 3 features dedicated mobility transport vehicles that circulate continuously along the main pedestrian concourse loop.`
  };

  const speakDescription = (deck: string) => {
    const text = DECK_DESCRIPTIONS[deck] || "";
    setAudioCueText(text);

    if (!window.speechSynthesis) {
      alert("Audio speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Submit Usher Help request
  const handleSubmitUsher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!section.trim()) return;

    const newReq: AssistRequest = {
      id: "REQ-" + (Math.floor(Math.random() * 900) + 100),
      section: section,
      serviceType: serviceType,
      status: "Received"
    };

    setRequests([newReq, ...requests]);
    setSection("");

    // Simulate usher moving to "Usher Dispatched"
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === newReq.id ? { ...r, status: "Usher Dispatched" } : r));
    }, 4000);
  };

  return (
    <div className="space-y-6" id="accessibility-workspace">
      {/* Dynamic Font Controller & Accessibility Welcome */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" id="accessibility-controls-header">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <Accessibility className="w-5 h-5 text-brand-green" />
            Universal Accessibility & Emergency Desk
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Custom assistive controllers, sensory aids dispatcher, and immediate emergency beacon.</p>
        </div>

        {/* Font size selectors */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Font Size</span>
          <button
            onClick={() => setFontSizeClass("text-sm")}
            className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${fontSizeClass === "text-sm" ? "bg-brand-gold text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            A
          </button>
          <button
            onClick={() => setFontSizeClass("text-base")}
            className={`px-3 py-1 rounded text-sm font-bold cursor-pointer ${fontSizeClass === "text-base" ? "bg-brand-gold text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            A+
          </button>
          <button
            onClick={() => setFontSizeClass("text-lg")}
            className={`px-4 py-1.5 rounded text-base font-bold cursor-pointer ${fontSizeClass === "text-lg" ? "bg-brand-gold text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            A++
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="assist-blocks-container">
        {/* Left Column: Audio Describer Desk */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="audio-describer-deck">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Eye className="w-4.5 h-4.5 text-brand-gold" /> Visually Impaired Audio Guide
          </h3>
          <p className="text-slate-400 text-xs">
            Select a stadium zone below. The system will synthesize a verbal audio waypoint description to guide you to accessible seats, wheelchair decks, and restroom exits.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => speakDescription("lower")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-100 rounded-xl transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
            >
              <Volume2 className="w-4 h-4 text-brand-green" />
              Lower Bowl Deck
            </button>
            <button
              onClick={() => speakDescription("club")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-100 rounded-xl transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
            >
              <Volume2 className="w-4 h-4 text-brand-gold" />
              Club Suites Deck
            </button>
            <button
              onClick={() => speakDescription("upper")}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-100 rounded-xl transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center"
            >
              <Volume2 className="w-4 h-4 text-brand-blue" />
              Upper Tier Deck
            </button>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1" id="audio-readout-display">
            <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-mono">Verbal Readout Transcript</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{audioCueText}</p>
          </div>
        </div>

        {/* Right Column: Physical Assist Usher Desk */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="physical-assist-desk">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Users className="w-4.5 h-4.5 text-brand-green" /> Sensory & Mobility Usher dispatch
          </h3>
          <p className="text-slate-400 text-xs">
            Need wheelchair assistance, sensory ear defenders, or physical assistance at your seat? File a request and our nearest stadium host will be dispatched.
          </p>

          <form onSubmit={handleSubmitUsher} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400">Seat Section/Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sec 114, Row F, Seat 8"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400">Assistance Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="Wheelchair Escort">Wheelchair Escort</option>
                  <option value="Sensory Ear Defenders">Sensory Headphones</option>
                  <option value="Physical Usher Guide">Physical Usher Guide</option>
                  <option value="Sign Language Interpreter">ASL / Sign Interpreter</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              id="btn-trigger-usher"
              className="w-full py-2.5 bg-brand-gold hover:bg-[#b08e4d] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Dispatch Assist Host
            </button>
          </form>

          {/* Active Help queues */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">Active Assist Requests</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {requests.map((req) => (
                <div key={req.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <span className="font-bold text-slate-200 block">{req.section}</span>
                    <span className="text-[10px] text-slate-400">{req.serviceType}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    req.status === "Arrived" ? "bg-brand-green/10 text-brand-green" : "bg-brand-blue/15 text-brand-blue animate-pulse"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY RED PANIC BUTTON SECTION */}
      <div className="bg-red-950/30 border border-red-500/20 rounded-3xl p-6 relative overflow-hidden" id="emergency-panic-section">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-red-400 font-display flex items-center justify-center md:justify-start gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" /> Immediate Medical or Security Help
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Are you in physical danger, having a medical emergency, or witnessing a critical threat? Tap the Emergency red button. Your location coordinates are broadcasted instantly to the lead operations dispatch.
            </p>
          </div>

          <div className="shrink-0">
            <button
              id="btn-emergency-panic"
              onClick={() => {
                setIsEmergencyActive(true);
                alert("🚨 STADIUM EMERGENCY BROADCAST ACTIVE! Security and Paramedics dispatched to seating grid. Close this popup to review telemetry tracking.");
              }}
              className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 border-4 border-red-900/60 shadow-2xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all text-white font-black text-xs uppercase tracking-widest flex items-center justify-center text-center select-none cursor-pointer"
            >
              Panic<br />Help
            </button>
          </div>
        </div>

        {/* Emergency status display */}
        {isEmergencyActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl space-y-3 text-xs"
            id="emergency-beacon-readout"
          >
            <div className="flex justify-between items-center text-red-400 font-bold font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Live Telemetry Beacon Active
              </span>
              <span>GPS: MET-SEC-A4</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-wider text-[10px]">Closest Medical Tent Exit:</span>
                <p>Proceed straight through General concourse to <strong className="text-white">Gate D</strong>, Med-Post 2 is next to the elevator shaft.</p>
              </div>
              <div className="space-y-1">
                <span className="block font-bold text-white uppercase tracking-wider text-[10px]">ETA of Medical Team:</span>
                <p>Lead usher squad dispatched. Est. arrival <strong className="text-brand-green font-mono">1 min 45 secs</strong>.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                id="btn-cancel-panic"
                onClick={() => setIsEmergencyActive(false)}
                className="px-3 py-1 bg-white/10 hover:bg-white/15 text-slate-300 rounded border border-white/10 text-[10px] transition cursor-pointer"
              >
                Cancel Panic Broadcast
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
