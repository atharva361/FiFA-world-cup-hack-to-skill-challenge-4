import React, { useState } from "react";
import { Stadium, OperationsMetrics } from "../types";
import { 
  Leaf, 
  Trash2, 
  Zap, 
  Award, 
  TrendingDown, 
  CheckSquare, 
  Share2, 
  Bus, 
  Info,
  Car
} from "lucide-react";
import { motion } from "motion/react";

interface SustainabilityTrackerProps {
  selectedStadium: Stadium;
  metrics: OperationsMetrics;
}

export default function SustainabilityTracker({ selectedStadium, metrics }: SustainabilityTrackerProps) {
  // Calculator inputs
  const [distance, setDistance] = useState<number>(15);
  const [transportMode, setTransportMode] = useState<string>("train");
  const [showCertification, setShowCertification] = useState(false);

  // CO2 factors (kg of CO2 per km)
  const CO2_FACTORS: Record<string, number> = {
    train: 0.041,
    shuttle: 0.015, // Electric bus shuttle
    ev: 0.052,
    car: 0.171, // Standard gasoline car
    cycle: 0.000
  };

  const calculateEmissions = () => {
    const factor = CO2_FACTORS[transportMode] ?? 0.041;
    return Number((distance * factor).toFixed(2));
  };

  // Compare standard car emission vs selected transport to find kg of CO2 saved
  const calculateSavings = () => {
    const carEmissions = distance * CO2_FACTORS.car;
    const selectedEmissions = distance * (CO2_FACTORS[transportMode] ?? 0.041);
    const diff = carEmissions - selectedEmissions;
    return Number(Math.max(0, diff).toFixed(2));
  };

  return (
    <div className="space-y-6" id="sustainability-section">
      {/* Intro Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5" id="sustainability-intro">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
          <Leaf className="w-5 h-5 text-brand-green animate-pulse" />
          ESG Zero-Waste Arena Tracker
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Tracking carbon offsets, circular waste recycling, and green energy metrics to power the first Net-Zero FIFA World Cup.
        </p>
      </div>

      {/* Grid of ESG Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="esg-telemetry-grid">
        {/* Carbon Offset */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-mono">Carbon Offsets Today</span>
            <span className="text-2xl font-extrabold text-white font-mono">{metrics.carbonSavedKg.toLocaleString()} kg</span>
            <p className="text-[10px] text-brand-green font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Over standard transport baselines
            </p>
          </div>
        </div>

        {/* Circular Recycling */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-mono">Waste Diversion Rate</span>
            <span className="text-2xl font-extrabold text-white font-mono">{metrics.wasteRecycledPercent}%</span>
            <span className="text-[10px] text-slate-400 block">Composted, upcycled or energy-converted</span>
          </div>
        </div>

        {/* Renewable Energy */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="block text-slate-400 text-[10px] uppercase tracking-widest font-mono">Clean Energy Power</span>
            <span className="text-2xl font-extrabold text-white font-mono">100% LED</span>
            <span className="text-[10px] text-slate-400 block">Solar canopy & grid offsets validated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="calculator-section">
        {/* Left: Carbon Footprint Calculator */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="carbon-calculator">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Award className="w-4.5 h-4.5 text-brand-gold" /> Transit Carbon Calculator
          </h3>
          <p className="text-slate-400 text-xs">
            Calculate your personal travel emissions and unlock your **Green Fan Digital Certification** to help support sustainable operations.
          </p>

          {/* Travel Distance Input */}
          <div className="space-y-1.5">
            <label className="block text-xs text-slate-400 font-semibold">Estimated Round-Trip Distance (km)</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-brand-gold"
              />
              <span className="font-mono font-bold text-white shrink-0 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm">
                {distance} km
              </span>
            </div>
          </div>

          {/* Transportation Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs text-slate-400 font-semibold">Travel Medium</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setTransportMode("train")}
                className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                  transportMode === "train" ? "bg-brand-green/15 border-brand-green/40 text-brand-green" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Bus className="w-4 h-4 shrink-0" /> Metro/Train
              </button>
              <button
                onClick={() => setTransportMode("shuttle")}
                className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                  transportMode === "shuttle" ? "bg-brand-green/15 border-brand-green/40 text-brand-green" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Bus className="w-4 h-4 shrink-0" /> EV Shuttle
              </button>
              <button
                onClick={() => setTransportMode("ev")}
                className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                  transportMode === "ev" ? "bg-brand-green/15 border-brand-green/40 text-brand-green" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Car className="w-4 h-4 shrink-0" /> Electric Car
              </button>
              <button
                onClick={() => setTransportMode("car")}
                className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                  transportMode === "car" ? "bg-rose-950/20 border-rose-500/30 text-rose-300" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Car className="w-4 h-4 shrink-0" /> Petrol Car
              </button>
              <button
                onClick={() => setTransportMode("cycle")}
                className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                  transportMode === "cycle" ? "bg-brand-green/15 border-brand-green/40 text-brand-green" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Leaf className="w-4 h-4 shrink-0" /> Cycle/Walk
              </button>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Est. CO2 Footprint</span>
              <span className={`text-xl font-extrabold font-mono block mt-1 ${transportMode === 'car' ? 'text-rose-400' : 'text-slate-100'}`}>
                {calculateEmissions()} kg CO2
              </span>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] text-brand-green uppercase tracking-widest block font-semibold">Total Carbon Saved</span>
              <span className="text-xl font-extrabold font-mono text-brand-green block mt-1">
                +{calculateSavings()} kg CO2
              </span>
            </div>
          </div>

          <button
            id="btn-generate-cert"
            onClick={() => setShowCertification(true)}
            className="w-full py-3 bg-brand-gold hover:bg-[#b08e4d] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Claim Green Fan Certificate
          </button>
        </div>

        {/* Right: Green Certificate Display Card */}
        <div className="flex flex-col justify-center">
          {showCertification ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative rounded-3xl overflow-hidden border border-brand-gold/30 bg-gradient-to-br from-white/5 via-brand-blue/10 to-white/5 backdrop-blur-md p-8 shadow-2xl text-center space-y-4"
              id="green-cert-display"
            >
              {/* Confetti element simulation */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-green/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-2xl" />

              <div className="inline-flex p-4 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-brand-gold font-display uppercase tracking-wider">
                  Green Fan Certified
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  StadiumGPT ESG Validation Suite
                </p>
              </div>

              <div className="border-y border-white/10 py-4 space-y-2">
                <p className="text-xs text-slate-200 leading-relaxed">
                  Congratulations! By choosing <strong className="text-brand-green">{transportMode.toUpperCase()}</strong> transit over petrol, you single-handedly saved <strong className="text-white font-mono">{calculateSavings()} kg</strong> of greenhouse carbon emission on your trip to <strong>{selectedStadium.name}</strong>.
                </p>
                <div className="text-[11px] text-slate-400 italic">
                  FIFA World Cup 2026 ESG Registry | ID: FW26-{Math.floor(Math.random() * 89000) + 10000}
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-center">
                <button 
                  onClick={() => alert("Certificate shared to digital FIFA Wallet!")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Save to Wallet
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 text-center text-slate-500 border-2 border-dashed border-white/10 bg-white/5 rounded-3xl py-16 space-y-2" id="cert-placeholder">
              <Award className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-slate-400 text-sm">Certificate Pending Claim</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Configure your travel parameters and click **Claim Green Fan Certificate** to generate your official carbon saver badge.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
