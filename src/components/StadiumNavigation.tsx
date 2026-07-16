import React, { useState } from "react";
import { Stadium, TransitHub, StadiumGate } from "../types";
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Bus, 
  Train, 
  Car, 
  Accessibility, 
  Clock, 
  ShieldCheck, 
  Map, 
  AlertTriangle,
  Info
} from "lucide-react";
import { motion } from "motion/react";

interface StadiumNavigationProps {
  selectedStadium: Stadium;
}

export default function StadiumNavigation({ selectedStadium }: StadiumNavigationProps) {
  const [activeMapMode, setActiveMapMode] = useState<"google" | "internal">("internal");
  const [selectedStart, setSelectedStart] = useState<string>(selectedStadium.transitHubs[0]?.name || "");
  const [selectedEnd, setSelectedEnd] = useState<string>(selectedStadium.gates[0]?.name || "");
  const [isSimulatingPath, setIsSimulatingPath] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<number | null>(null);

  // Generate Google Maps Embed query string
  const getGoogleMapsUrl = () => {
    const encodedQuery = encodeURIComponent(selectedStadium.name + ", " + selectedStadium.location);
    return `https://maps.google.com/maps?q=${encodedQuery}&t=k&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  const handleSimulate = () => {
    setIsSimulatingPath(true);
    setSimulatedTime(null);
    
    setTimeout(() => {
      setIsSimulatingPath(false);
      // Base time on target gate queue wait + estimated walking distance (approx 5 - 12 mins)
      const targetGate = selectedStadium.gates.find(g => g.name === selectedEnd);
      const walkTime = Math.floor(Math.random() * 6) + 5; // 5 to 10 mins
      const totalTime = walkTime + (targetGate ? targetGate.waitMinutes : 10);
      setSimulatedTime(totalTime);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="stadium-nav-section">
      {/* Header and Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-4 border border-white/10 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
            <Navigation className="w-5 h-5 text-brand-green" />
            Live Wayfinding & Maps
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Dual-mode navigation system: Real-world Google Map + Internal Gate-Path Routing.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            id="btn-mode-internal"
            onClick={() => setActiveMapMode("internal")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeMapMode === "internal" 
                ? "bg-brand-gold text-slate-950 shadow font-bold" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gate Pathfinding
          </button>
          <button
            id="btn-mode-google"
            onClick={() => setActiveMapMode("google")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeMapMode === "google" 
                ? "bg-brand-gold text-slate-950 shadow font-bold" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Google Maps Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="nav-workspace">
        {/* Left Control Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5" id="wayfinder-controls">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Compass className="w-4.5 h-4.5 text-brand-gold" /> Wayfinder Planner
            </h3>

            {/* Starting transit point */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">
                1. Select Arrival Point (Transit/Parking)
              </label>
              <select
                id="select-nav-start"
                value={selectedStart}
                onChange={(e) => {
                  setSelectedStart(e.target.value);
                  setSimulatedTime(null);
                }}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {selectedStadium.transitHubs.map((hub, idx) => (
                  <option key={idx} value={hub.name}>
                    {hub.name} ({hub.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Stadium Gate */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">
                2. Select Target Stadium Entry Gate
              </label>
              <select
                id="select-nav-end"
                value={selectedEnd}
                onChange={(e) => {
                  setSelectedEnd(e.target.value);
                  setSimulatedTime(null);
                }}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                {selectedStadium.gates.map((gate, idx) => (
                  <option key={idx} value={gate.name}>
                    {gate.name} ({gate.type})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-trigger-route"
              onClick={handleSimulate}
              disabled={isSimulatingPath || !selectedStart || !selectedEnd}
              className="w-full py-3 bg-brand-gold hover:bg-[#b08e4d] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              {isSimulatingPath ? "Calculating Walkway Route..." : "Plot Journey Route"}
            </button>

            {/* Simulated route metrics */}
            {simulatedTime !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3"
                id="route-report-card"
              >
                <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                  <span className="text-slate-400">Total Travel Time:</span>
                  <span className="font-bold text-brand-green font-mono text-sm">{simulatedTime} mins</span>
                </div>
                
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                    <span>Est. walk time: <strong className="text-white">~6-8 mins</strong> across safe green lanes.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Accessibility className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-0.5" />
                    <span>Step-free accessibility paths are 100% available on this route.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                    <span>Security lanes are clear. Proactive bag check before arriving.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Logistics Summary list */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3" id="transit-status-card">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <Bus className="w-4 h-4 text-brand-green" /> Transit Status Today
            </h4>
            <div className="space-y-2">
              {selectedStadium.transitHubs.map((hub, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{hub.name}</span>
                    <span className="text-[10px] text-slate-400">{hub.frequency}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    hub.status === "On Time" ? "bg-brand-green/10 text-brand-green border border-brand-green/20" : "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                  }`}>
                    {hub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Map Workspace Column */}
        <div className="lg:col-span-2">
          <div className="relative h-[530px] rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl flex flex-col" id="map-stage">
            {activeMapMode === "google" ? (
              /* Google Maps satellite/hybrid embed */
              <div className="w-full h-full relative">
                <iframe
                  id="google-maps-frame"
                  title="Google Maps Stadium Location"
                  src={getGoogleMapsUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="rounded-b-3xl opacity-90"
                />
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/90 border border-white/10 text-[10px] text-slate-300 max-w-xs backdrop-blur-md">
                  <span className="font-bold text-white block">📍 Live Google Maps Frame</span>
                  Interactive satellite overview of {selectedStadium.name}. Zoom and pan to find roads, highways, and surroundings.
                </div>
              </div>
            ) : (
              /* Internal Gate Pathfinding Interactive Graphic (SVG-based) */
              <div className="w-full h-full flex flex-col relative bg-slate-950">
                <div className="p-4 border-b border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-brand-green" /> Interactive Gate Layout & Transit Nodes
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-mono">
                    Green Lanes = Sustainable Pedestrian Path
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center relative p-6">
                  {/* SVG diagram representing stadium, gates, transit hubs */}
                  <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] select-none text-slate-400" id="interactive-stadium-svg">
                    {/* Background Grids */}
                    <defs>
                      <radialGradient id="stadiumGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0B1329" stopOpacity="0.9" />
                      </radialGradient>
                      <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00A651" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00A651" stopOpacity="0.1" />
                      </radialGradient>
                    </defs>

                    {/* Outer green pedestrian zone ring */}
                    <circle cx="300" cy="200" r="160" fill="none" stroke="#00A651" strokeWidth="2" strokeDasharray="6,6" opacity="0.4" />
                    
                    {/* Connection lines from Outer hubs to Inner gates */}
                    {/* Hub Train (Left Top) -> Gate A/B */}
                    <line x1="120" y1="100" x2="230" y2="160" stroke="#475569" strokeWidth="1.5" />
                    {/* Hub Shuttle (Right Top) -> Gate B/C */}
                    <line x1="480" y1="100" x2="370" y2="160" stroke="#475569" strokeWidth="1.5" />
                    {/* Hub Rideshare (Right Bottom) -> Gate C/VIP */}
                    <line x1="480" y1="300" x2="350" y2="240" stroke="#475569" strokeWidth="1.5" />
                    {/* Hub Parking (Left Bottom) -> Gate D/VIP */}
                    <line x1="120" y1="300" x2="240" y2="240" stroke="#475569" strokeWidth="1.5" />

                    {/* Active simulated path drawing if planner is simulated */}
                    {simulatedTime !== null && (
                      <motion.path
                        d="M 120 100 Q 200 130 250 160 Q 300 170 270 200"
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                      />
                    )}

                    {/* Stadium Outer Bowl */}
                    <ellipse cx="300" cy="200" rx="110" ry="75" fill="url(#stadiumGrad)" stroke="#1E293B" strokeWidth="3" />
                    {/* Seating Rings */}
                    <ellipse cx="300" cy="200" rx="90" ry="58" fill="none" stroke="#334155" strokeWidth="12" opacity="0.7" />
                    <ellipse cx="300" cy="200" rx="70" ry="42" fill="none" stroke="#0F172A" strokeWidth="6" />

                    {/* Football pitch in the center */}
                    <rect x="270" y="180" width="60" height="40" fill="url(#fieldGrad)" stroke="#00A651" strokeWidth="1.5" rx="2" />
                    <line x1="300" y1="180" x2="300" y2="220" stroke="#00A651" strokeWidth="1" opacity="0.6" />
                    <circle cx="300" cy="200" r="10" fill="none" stroke="#00A651" strokeWidth="1" opacity="0.6" />

                    {/* Inner Stadium Gates Dots */}
                    {/* Gate A (Top Left) */}
                    <circle cx="230" cy="160" r="8" fill="#1E293B" stroke="#00A651" strokeWidth="2" />
                    <text x="215" y="145" fill="#E2E8F0" fontSize="10" fontWeight="bold">Gate A</text>
                    
                    {/* Gate B (Top Right) */}
                    <circle cx="370" cy="160" r="8" fill="#1E293B" stroke="#C5A059" strokeWidth="2" />
                    <text x="355" y="145" fill="#E2E8F0" fontSize="10" fontWeight="bold">Gate B</text>

                    {/* Gate C (Bottom Right) */}
                    <circle cx="370" cy="240" r="8" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                    <text x="355" y="260" fill="#E2E8F0" fontSize="10" fontWeight="bold">Gate C</text>

                    {/* Gate D (Bottom Left) */}
                    <circle cx="230" cy="240" r="8" fill="#1E293B" stroke="#00A651" strokeWidth="2" />
                    <text x="215" y="260" fill="#E2E8F0" fontSize="10" fontWeight="bold">Gate D</text>

                    {/* Transit Hub Outer Nodes */}
                    {/* Metro Node Top-Left */}
                    <rect x="70" y="70" width="100" height="30" rx="6" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
                    <text x="80" y="88" fill="#93C5FD" fontSize="9" fontWeight="bold">Meadowlands (Train)</text>

                    {/* Shuttle Node Top-Right */}
                    <rect x="430" y="70" width="100" height="30" rx="6" fill="#0F172A" stroke="#00A651" strokeWidth="2" />
                    <text x="442" y="88" fill="#6EE7B7" fontSize="9" fontWeight="bold">Shuttle Loop</text>

                    {/* Rideshare Node Bottom-Right */}
                    <rect x="430" y="285" width="100" height="30" rx="6" fill="#0F172A" stroke="#C5A059" strokeWidth="2" />
                    <text x="445" y="303" fill="#FDE047" fontSize="9" fontWeight="bold">Uber/Lyft Hub</text>

                    {/* Parking Node Bottom-Left */}
                    <rect x="70" y="285" width="100" height="30" rx="6" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                    <text x="85" y="303" fill="#CBD5E1" fontSize="9" fontWeight="bold">Parking Lot G</text>
                  </svg>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-950/95 border border-white/10 rounded-xl flex items-center gap-3" id="stadium-legend">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green inline-block" />
                    <span className="text-[10px] text-slate-400">Clear (&lt;10m wait)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold inline-block" />
                    <span className="text-[10px] text-slate-400">Moderate (15-25m wait)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="text-[10px] text-slate-400">Heavy (&gt;30m wait)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
