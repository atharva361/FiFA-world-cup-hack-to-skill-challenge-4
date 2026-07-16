import React, { useState, useEffect } from "react";
import { Stadium, OperationsMetrics } from "../types";
import { STADIUMS } from "../data";
import { 
  Trophy, 
  MapPin, 
  Users, 
  Clock, 
  Ticket, 
  ShieldAlert, 
  Globe, 
  Compass, 
  CheckCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  selectedStadium: Stadium;
  setSelectedStadium: (s: Stadium) => void;
  metrics: OperationsMetrics;
  onNavigate: (tabId: string) => void;
}

export default function LandingPage({ 
  selectedStadium, 
  setSelectedStadium, 
  metrics,
  onNavigate 
}: LandingPageProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time until FIFA World Cup 2026 Kick-off (Approx. June 11, 2026)
  // Let's set it to some future date relative to current time (July 16, 2026) or since current time is July 2026, let's set a countdown to the Grand Final (which is say, July 19, 2026 at 15:00 UTC)
  useEffect(() => {
    const finalDate = new Date("2026-07-19T15:00:00-04:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = finalDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8" id="landing-container">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-brand-blue/30 to-brand-green/15 p-8 md:p-12 shadow-2xl" id="hero-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-gold font-medium text-xs tracking-wider uppercase">
              <Trophy className="w-4 h-4 text-brand-gold animate-pulse" />
              FIFA World Cup 2026 AI Command Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
              Elevating Operations, <br className="hidden md:inline" />
              <span className="text-brand-gold font-bold">
                Perfecting Fan Journeys
              </span>
            </h1>
            <p className="text-slate-300 max-w-xl text-base md:text-lg leading-relaxed">
              StadiumGPT integrates real-time crowd logistics, multimodal Google Gemini assistance, dynamic routing, and sustainability tracking to power the greenest, safest tournament in football history.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                id="btn-nav-chat"
                onClick={() => onNavigate("chatbot")}
                className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-[#b08e4d] text-slate-950 font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-brand-gold/20 cursor-pointer"
              >
                Access AI Chatbot
              </button>
              <button 
                id="btn-nav-analytics"
                onClick={() => onNavigate("analytics")}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all cursor-pointer"
              >
                Operations Dashboard
              </button>
            </div>
          </div>

          {/* Countdown Clock Card */}
          <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-xl" id="countdown-card">
            <div className="absolute top-2 right-2 text-xs font-mono text-brand-gold/80 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Live Time
            </div>
            <h3 className="text-sm font-semibold text-brand-gold tracking-wider uppercase mb-4">
              Grand Final Countdown
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-950/85 rounded-xl p-3 border border-white/10">
                <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Days</div>
              </div>
              <div className="bg-slate-950/85 rounded-xl p-3 border border-white/10">
                <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{timeLeft.hours}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Hours</div>
              </div>
              <div className="bg-slate-950/85 rounded-xl p-3 border border-white/10">
                <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{timeLeft.minutes}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Mins</div>
              </div>
              <div className="bg-slate-950/85 rounded-xl p-3 border border-white/10">
                <div className="text-2xl md:text-3xl font-extrabold text-brand-green font-mono">{timeLeft.seconds}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Secs</div>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-slate-400 italic">
              MetLife Stadium - July 19, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Stadium Switcher Zone */}
      <div className="space-y-4" id="stadium-switcher-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
              <MapPin className="w-6 h-6 text-emerald-400" />
              Venue & Stadium Selection
            </h2>
            <p className="text-slate-400 text-sm">Select an active stadium to load custom AI profiles and metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stadiums-grid">
          {STADIUMS.map((stadium) => {
            const isActive = selectedStadium.id === stadium.id;
            return (
              <button
                key={stadium.id}
                id={`stadium-card-${stadium.id}`}
                onClick={() => setSelectedStadium(stadium)}
                className={`relative overflow-hidden text-left rounded-2xl p-5 border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  isActive 
                    ? "bg-white/10 border-brand-gold ring-2 ring-brand-gold/20 shadow-lg shadow-brand-gold/10" 
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 bg-brand-gold text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Selected Venue
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-white font-display flex items-center gap-1.5">
                  {stadium.name}
                </h3>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {stadium.location}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Capacity</span>
                    <span className="font-mono font-bold text-white">{stadium.capacityStr}</span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Matches</span>
                    <span className="font-mono font-bold text-brand-green">{stadium.matches.length} Total</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stadium Live Operational Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="snapshot-section">
        {/* Left Column: Live Matches & Gate Load */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl" id="venue-details-card">
            <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-brand-gold" /> Matches Hosted at {selectedStadium.name}
            </h3>
            
            <div className="space-y-3">
              {selectedStadium.matches.map((match, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green font-mono text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{match}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded uppercase tracking-wider">
                    Official Venue
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Help Recommendation */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="ai-suggestion-teaser">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-brand-gold flex items-center gap-1.5 font-display">
                <Zap className="w-4 h-4 text-brand-gold animate-pulse" /> StadiumGPT Live Recommendation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Average gate wait is currently <span className="font-bold text-brand-gold">{metrics.queueTime} mins</span>. Our AI model recommends routing fans arriving from Meadowlands/Tlalpan/Transit to general gates A & VIP West to reduce bottlenecks.
              </p>
            </div>
            <button 
              id="btn-quick-nav-route"
              onClick={() => onNavigate("navigation")}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-100 border border-white/10 rounded-xl text-xs font-semibold tracking-wide transition-all self-stretch md:self-auto text-center cursor-pointer"
            >
              Show Routes
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry / Operating Summary */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6" id="telemetry-card">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 border-b border-white/10 pb-3">
              <Compass className="w-5 h-5 text-brand-green" /> Operational Metrics
            </h3>

            {/* Occupancy Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Stands Occupancy Load</span>
                <span className="font-mono font-bold text-white">{metrics.crowdLoad}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    metrics.crowdLoad > 85 ? "bg-red-500" : metrics.crowdLoad > 70 ? "bg-brand-gold" : "bg-brand-green"
                  }`}
                  style={{ width: `${metrics.crowdLoad}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Active Incidents</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldAlert className={`w-4 h-4 ${metrics.incidentCount > 2 ? 'text-red-500' : 'text-brand-gold'}`} />
                  <span className="font-bold text-lg text-white font-mono">{metrics.incidentCount}</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Weather Status</span>
                <span className="font-medium text-xs text-white block truncate mt-1.5">{metrics.weather.split(",")[0]}</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 col-span-2">
                <span className="block text-[10px] text-brand-green uppercase tracking-widest font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> ESG Sustainability Impact
                </span>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Carbon Offset:</span>
                  <span className="text-xs font-bold font-mono text-brand-green">+{metrics.carbonSavedKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Panel */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Quick Operations Access</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onNavigate("sustainability")}
                  className="p-2 text-center text-xs rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  ESG Analytics
                </button>
                <button 
                  onClick={() => onNavigate("accessibility")}
                  className="p-2 text-center text-xs rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  Accessibility
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
