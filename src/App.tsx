import React, { useState, useEffect } from "react";
import { Stadium, OperationsMetrics } from "./types";
import { STADIUMS, INITIAL_METRICS } from "./data";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import StadiumNavigation from "./components/StadiumNavigation";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SustainabilityTracker from "./components/SustainabilityTracker";
import AccessibilityAssistant from "./components/AccessibilityAssistant";

import { 
  Trophy, 
  Home, 
  Bot, 
  Navigation, 
  Sliders, 
  Leaf, 
  Accessibility, 
  Menu, 
  X,
  Globe,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [selectedStadium, setSelectedStadium] = useState<Stadium>(STADIUMS[0]);
  const [metrics, setMetrics] = useState<OperationsMetrics>(INITIAL_METRICS[STADIUMS[0].id]);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [fontSizeClass, setFontSizeClass] = useState<string>("text-sm");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync metrics when stadium selection changes
  useEffect(() => {
    setMetrics(INITIAL_METRICS[selectedStadium.id] || INITIAL_METRICS.metlife);
  }, [selectedStadium]);

  const navItems = [
    { id: "home", label: "Landing", icon: Home },
    { id: "chatbot", label: "AI Assistant", icon: Bot },
    { id: "navigation", label: "Wayfinder", icon: Navigation },
    { id: "analytics", label: "Operations Desk", icon: Sliders },
    { id: "sustainability", label: "ESG Arena", icon: Leaf },
    { id: "accessibility", label: "Universal Help", icon: Accessibility }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans" id="stadium-gpt-root">
      {/* Background Gradient Blurs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-1/12 left-1/10 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/12 right-1/10 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[200px]" />
      </div>

      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between" id="global-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <span className="text-white font-bold text-xl italic font-display">26</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Stadium<span className="text-brand-gold">GPT</span>
              </span>
              <span className="text-[9px] font-bold bg-white/5 border border-white/10 text-brand-gold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                FIFA 2026 Core
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">World Cup Operations Command</p>
          </div>
        </div>

        {/* Desktop Navbar Items from Elegant Dark template */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-all duration-200 pb-1 cursor-pointer border-b-2 text-xs uppercase tracking-wider ${
                  isActive 
                    ? "text-white border-brand-gold font-bold" 
                    : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Live Match ticker overlay and Gemini Status Badge */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
            <span className="text-[11px] text-slate-300">Gemini Pro Live</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-brand-green animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-bold text-slate-300 font-mono text-[10px] uppercase tracking-wider">{metrics.queueTime}m Queue</span>
          </div>
        </div>

        {/* Mobile menu toggle button */}
        <button
          id="btn-toggle-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl border border-white/10 transition-all cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col lg:flex-row" id="layout-body">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/5 border-r border-white/10 p-4 space-y-6 shrink-0" id="sidebar-nav">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3">Control Suite</span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                      isActive 
                        ? "bg-white/10 border-l-4 border-brand-gold text-white shadow-md" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    } cursor-pointer`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Connected Stadium quick telemetry widget */}
          <div className="mt-auto p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3" id="connected-stadium-card">
            <div className="space-y-0.5">
              <span className="block text-[9px] text-brand-green uppercase tracking-widest font-bold">Active Venue Profile</span>
              <h4 className="font-bold text-slate-200 text-xs truncate">{selectedStadium.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{selectedStadium.location}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] text-center font-mono">
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[8px] uppercase">Wait</span>
                <span className="font-bold text-white">{metrics.queueTime}m</span>
              </div>
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[8px] uppercase">Load</span>
                <span className="font-bold text-brand-green">{metrics.crowdLoad}%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Dropdown Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden fixed top-[73px] left-0 right-0 bg-slate-950 border-b border-white/10 z-30 p-4 space-y-3"
              id="mobile-nav-panel"
            >
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-btn-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? "bg-white/15 border-l-3 border-brand-gold text-white" 
                          : "text-slate-400 hover:text-slate-200 bg-white/5"
                      } cursor-pointer`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Connected venue metrics indicator inside mobile dropdown */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Stadium Profile</span>
                  <span className="font-bold text-white">{selectedStadium.name}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[10px] block uppercase">Avg Queue</span>
                  <span className="font-bold text-brand-green">{metrics.queueTime} mins</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Content Area */}
        <main className={`flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full ${fontSizeClass}`} id="core-content-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedStadium.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "home" && (
                <LandingPage 
                  selectedStadium={selectedStadium}
                  setSelectedStadium={setSelectedStadium}
                  metrics={metrics}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === "chatbot" && (
                <Chatbot selectedStadium={selectedStadium} />
              )}

              {activeTab === "navigation" && (
                <StadiumNavigation selectedStadium={selectedStadium} />
              )}

              {activeTab === "analytics" && (
                <AnalyticsDashboard selectedStadium={selectedStadium} />
              )}

              {activeTab === "sustainability" && (
                <SustainabilityTracker selectedStadium={selectedStadium} metrics={metrics} />
              )}

              {activeTab === "accessibility" && (
                <AccessibilityAssistant 
                  selectedStadium={selectedStadium}
                  fontSizeClass={fontSizeClass}
                  setFontSizeClass={setFontSizeClass}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-6 px-8 text-center text-[10px] text-slate-500 font-medium tracking-wider flex flex-col md:flex-row justify-between items-center gap-4" id="global-footer">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            <span>System Integrity: High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span>Fan Support: 142 Active Agents</span>
          </div>
        </div>
        <div className="flex gap-6 uppercase tracking-widest text-[9px]">
          <span className="hover:text-brand-gold cursor-pointer" onClick={() => setActiveTab("accessibility")}>Emergency Assistance</span>
          <span className="hover:text-brand-gold cursor-pointer" onClick={() => setActiveTab("accessibility")}>Accessibility Services</span>
        </div>
        <div className="text-white/40 italic font-display">FIFA WORLD CUP 2026™ | POWERED BY GOOGLE CLOUD</div>
      </footer>
    </div>
  );
}
