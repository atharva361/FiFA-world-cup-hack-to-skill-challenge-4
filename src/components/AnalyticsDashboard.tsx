import React, { useState, useEffect } from "react";
import { Stadium, IncidentReport, Volunteer, AIAction, OperationsMetrics } from "../types";
import { 
  STADIUMS, 
  INITIAL_METRICS, 
  INITIAL_INCIDENTS, 
  INITIAL_VOLUNTEERS 
} from "../data";
import { 
  TrendingUp, 
  Sliders, 
  ShieldAlert, 
  Users, 
  AlertTriangle, 
  Cpu, 
  Plus, 
  CheckCircle, 
  HelpCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalyticsDashboardProps {
  selectedStadium: Stadium;
}

export default function AnalyticsDashboard({ selectedStadium }: AnalyticsDashboardProps) {
  // 1. Dynamic States for live metrics sliders
  const [crowdLoad, setCrowdLoad] = useState(75);
  const [openGates, setOpenGates] = useState(6);
  const [queueTime, setQueueTime] = useState(15);
  const [incidentCount, setIncidentCount] = useState(1);
  
  // 2. State for Incidents logs
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [volunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  
  // 3. AI Generated Recommendations states
  const [aiData, setAiData] = useState<{
    stadiumStatus: string;
    crowdSafetyIndex: number;
    alerts: string[];
    actions: AIAction[];
  } | null>(null);

  const [aiBriefing, setAiBriefing] = useState<string>("Operations stable. Click 'Regenerate AI Analysis' to fetch active guidelines.");
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  // 4. Modal/Form state for filing new incident
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    location: "",
    type: "Medical" as "Medical" | "Security" | "Facilities" | "Crowd Control",
    severity: "Medium" as "Critical" | "High" | "Medium" | "Low"
  });

  // Sync sliders to selected stadium on initial change
  useEffect(() => {
    const venueMetrics = INITIAL_METRICS[selectedStadium.id] || INITIAL_METRICS.metlife;
    setCrowdLoad(venueMetrics.crowdLoad);
    setOpenGates(venueMetrics.openGates);
    setQueueTime(venueMetrics.queueTime);
    setIncidentCount(venueMetrics.incidentCount);

    // Initial filter of incidents belonging to this stadium
    const filteredIncidents = INITIAL_INCIDENTS.filter(inc => 
      inc.location.toLowerCase().includes(selectedStadium.name.toLowerCase()) ||
      (selectedStadium.id === "metlife" && inc.location.toLowerCase().includes("metlife")) ||
      (selectedStadium.id === "azteca" && inc.location.toLowerCase().includes("azteca")) ||
      (selectedStadium.id === "sofi" && inc.location.toLowerCase().includes("sofi"))
    );
    setMessagesAndIncidents(filteredIncidents);
  }, [selectedStadium]);

  const setMessagesAndIncidents = (filteredIncidents: IncidentReport[]) => {
    setIncidents(filteredIncidents);
  };

  // 5. Query Gemini recommendations endpoint
  const fetchAiRecommendations = async () => {
    setIsAiLoading(true);
    setIsBriefingLoading(true);
    try {
      // Fetch dynamic Recommendations
      const recRes = await fetch("/api/gemini/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crowdLoad,
          openGates,
          queueTime,
          incidentCount,
          activeStadium: selectedStadium.name,
          weather: "Sunny, 24°C"
        })
      });

      if (!recRes.ok) throw new Error("Recommendations request failed");
      const rData = await recRes.json();
      setAiData(rData);

      // Fetch dynamic text Briefing
      const summaryString = `Stands Crowd Load: ${crowdLoad}%, Open Entrance Gates: ${openGates}, Average Queue Time: ${queueTime} mins, Active Emergency Incidents: ${incidentCount}`;
      const briefingRes = await fetch("/api/gemini/analytics-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metricsSummary: summaryString })
      });

      if (briefingRes.ok) {
        const bData = await briefingRes.json();
        setAiBriefing(bData.insights);
      }
    } catch (err) {
      console.error("AI Operations Fetch Error:", err);
      // Fail gracefully: populate robust demo mock response
      setAiData({
        stadiumStatus: crowdLoad > 85 ? "Congested Crowd warning" : "Normal Operations",
        crowdSafetyIndex: Math.max(10, 100 - (100 - crowdLoad) - incidentCount * 8),
        alerts: [
          `Dynamic re-routing active at ${selectedStadium.name}.`,
          `High queues detected. Direct transit to Gate A.`
        ],
        actions: [
          {
            title: "Pacing Gates & Entry Control",
            severity: "High",
            desc: "Restrict transit rate from arrival lines. Direct excess queues to auxiliary open lanes.",
            targetDept: "Security / Volunteers"
          },
          {
            title: "Deploy Electric Shuttles",
            severity: "Moderate",
            desc: "Trigger high-frequency EV shuttle loops to mitigate high heat and passenger crowd fatigue.",
            targetDept: "Transit"
          }
        ]
      });
    } finally {
      setIsAiLoading(false);
      setIsBriefingLoading(false);
    }
  };

  // Run AI analysis once on load or when parameters shift dramatically
  useEffect(() => {
    fetchAiRecommendations();
  }, [selectedStadium]); // Fetch when stadium selection changes

  // Add dynamic ticket
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.location) return;

    const added: IncidentReport = {
      id: "INC-" + (Math.floor(Math.random() * 900) + 200),
      location: selectedStadium.name + " - " + newIncident.location,
      type: newIncident.type,
      severity: newIncident.severity,
      status: "Reported",
      reportedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      assignedTeam: "Pending Coordinator Dispatch"
    };

    setIncidents([added, ...incidents]);
    setIncidentCount(prev => prev + 1);
    setShowIncidentModal(false);
    setNewIncident({ location: "", type: "Medical", severity: "Medium" });
  };

  // Toggle ticket resolution status
  const handleResolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: inc.status === "Resolved" ? "On-Scene" : "Resolved",
          assignedTeam: inc.status === "Resolved" ? "Dispatched Crew" : "Field Support Resolved"
        };
      }
      return inc;
    }));
    // Reduce incident counter if resolved
    setIncidentCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-6" id="dashboard-wrapper">
      {/* Dynamic Command Adjuster Slider Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Adjusters Column */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-6" id="ops-sliders">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
              <Sliders className="w-4.5 h-4.5 text-brand-gold" /> Operational Adjusters
            </h3>
            <p className="text-[10px] text-slate-400 mt-1.5">Simulate different stadium load scenarios to test real-time Gemini operations recommendations.</p>
          </div>

          {/* Crowd Load */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Stadium Occupancy</span>
              <span className="text-white font-bold">{crowdLoad}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={crowdLoad} 
              onChange={(e) => setCrowdLoad(Number(e.target.value))}
              className="w-full accent-brand-gold"
            />
          </div>

          {/* Open Gates */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Open Entrance Gates</span>
              <span className="text-white font-bold">{openGates} / 8</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="8" 
              value={openGates} 
              onChange={(e) => setOpenGates(Number(e.target.value))}
              className="w-full accent-brand-gold"
            />
          </div>

          {/* Queue Wait Time */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Line Queue Wait Time</span>
              <span className="text-white font-bold">{queueTime}m</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="60" 
              value={queueTime} 
              onChange={(e) => setQueueTime(Number(e.target.value))}
              className="w-full accent-brand-gold"
            />
          </div>

          {/* Incidents Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Active Field Incidents</span>
              <span className="text-white font-bold">{incidentCount}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={incidentCount} 
              onChange={(e) => setIncidentCount(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <button
            id="btn-recalculate-ai"
            onClick={fetchAiRecommendations}
            disabled={isAiLoading}
            className="w-full py-3 bg-brand-gold hover:bg-[#b08e4d] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            {isAiLoading ? "Analyzing Metrics..." : "Regenerate AI Analysis"}
          </button>
        </div>

        {/* Right Gemini Output Recommendations Suite */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Briefing Statement */}
          <div className="bg-gradient-to-r from-brand-blue/20 via-slate-950/60 to-brand-green/10 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden" id="ai-briefing-alert">
            <div className="absolute top-0 right-0 p-3 text-[9px] font-mono font-bold text-brand-green uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> operations core
            </div>
            <h4 className="text-xs font-extrabold text-brand-gold uppercase tracking-widest mb-1.5 flex items-center gap-1 font-display">
              <Sparkles className="w-4 h-4 text-brand-gold" /> AI Lead Command Briefing
            </h4>
            
            {isBriefingLoading ? (
              <div className="py-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-ping" />
                <span className="text-xs text-slate-400 font-mono italic">Gemini operations team is writing briefing notes...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{aiBriefing}</p>
            )}
          </div>

          {/* Main AI Recommendations Cards */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5" id="ai-recommendations-display">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-white text-base font-display">Real-time Operations Recommendations</h3>
                <p className="text-[10px] text-slate-400">Structured action tickets pushed from Gemini 3.5 Operational analysis.</p>
              </div>

              {/* Overall status dial */}
              <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="text-right">
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Safety Index</span>
                  <span className="font-bold text-sm text-brand-green font-mono">
                    {aiData?.crowdSafetyIndex || 85} / 100
                  </span>
                </div>
                <div className="text-right border-l border-white/10 pl-4">
                  <span className="block text-[9px] text-slate-400 uppercase tracking-widest">Venue Status</span>
                  <span className="font-bold text-xs text-white uppercase tracking-wider block">
                    {aiData?.stadiumStatus || "Optimal Flow"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations Action Grid */}
            {isAiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin" />
                <span className="text-xs text-slate-400 font-mono italic">Synthesizing telemetry data across gates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="ai-actions-grid">
                {aiData?.actions.map((act, index) => {
                  const isCritical = act.severity === "Critical" || act.severity === "High";
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:bg-white/10 ${
                        isCritical 
                          ? "bg-red-500/5 border-red-500/20" 
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isCritical ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                          }`}>
                            {act.severity} Task
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                            {act.targetDept}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 font-display pt-1">{act.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{act.desc}</p>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button className="px-3 py-1 bg-slate-950/90 border border-white/10 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-white transition cursor-pointer">
                          Dispatch Command
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incident Logger Control Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="operations-control-room">
        {/* Active Incident Tickets List */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4" id="incident-logger">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500" /> Active Venue Incidents
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Control room logging desk. Medical and Security dispatches.</p>
            </div>

            <button
              id="btn-add-incident-modal"
              onClick={() => setShowIncidentModal(true)}
              className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Incident
            </button>
          </div>

          {/* Incident Tickets Table */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {incidents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs italic">
                All logs cleared. No active emergencies inside the stadium.
              </div>
            ) : (
              incidents.map((inc) => {
                const isResolved = inc.status === "Resolved";
                return (
                  <div 
                    key={inc.id}
                    id={`incident-row-${inc.id}`}
                    className={`p-3.5 rounded-xl border flex flex-col md:flex-row justify-between md:items-center gap-3 transition-all ${
                      isResolved 
                        ? "bg-white/5 border-white/5 opacity-60" 
                        : inc.severity === "Critical" 
                        ? "bg-red-500/5 border-red-500/20" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">{inc.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          inc.severity === "Critical" ? "bg-red-500/10 text-red-400" : "bg-brand-gold/10 text-brand-gold"
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{inc.reportedAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{inc.location}</h4>
                      <p className="text-[11px] text-slate-400">Type: <strong className="text-slate-300">{inc.type}</strong> | Assigned: <strong className="text-slate-300">{inc.assignedTeam}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                        isResolved 
                          ? "bg-brand-green/10 text-brand-green border-brand-green/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {inc.status}
                      </span>
                      <button
                        id={`btn-toggle-incident-${inc.id}`}
                        onClick={() => handleResolveIncident(inc.id)}
                        className={`px-3 py-1 text-[10px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          isResolved 
                            ? "bg-white/10 border-white/10 text-slate-400 hover:text-white" 
                            : "bg-brand-green/10 hover:bg-brand-green/20 border-brand-green/20 text-brand-green"
                        }`}
                      >
                        {isResolved ? "Re-open" : "Mark Resolved"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Volunteer Coordinator List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 animate-fade-in" id="volunteer-roster">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Users className="w-4.5 h-4.5 text-brand-green" /> Active Volunteer Squad
          </h3>

          <div className="space-y-3">
            {volunteers.map((vol) => (
              <div key={vol.id} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 text-xs">{vol.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    vol.status === "Active" ? "bg-brand-green/10 text-brand-green" : "bg-slate-800 text-slate-400"
                  }`}>
                    {vol.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>Assignment: <strong className="text-slate-300">{vol.assignedGate}</strong></p>
                  <p>Duty Role: <strong className="text-slate-300">{vol.role}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW INCIDENT REPORT MODAL (Absolute Overlay) */}
      <AnimatePresence>
        {showIncidentModal && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white font-display border-b border-white/10 pb-3 mb-4">
                File Emergency Incident Ticket
              </h3>

              <form onSubmit={handleCreateIncident} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400">Incident Category</label>
                  <select
                    id="modal-incident-type"
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Medical">Medical Emergency</option>
                    <option value="Security">Security Issue</option>
                    <option value="Facilities">Facilities Damage</option>
                    <option value="Crowd Control">Crowd Bottleneck</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-slate-400">Severity Rating</label>
                  <select
                    id="modal-incident-severity"
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Critical">Critical (Immediate dispatch)</option>
                    <option value="High">High (High priority dispatch)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-slate-400">Precise Location description</label>
                  <input
                    type="text"
                    id="modal-incident-location"
                    required
                    placeholder="e.g. Concourse outside Sec 212, behind hot dog stand"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20"
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    id="btn-close-modal"
                    onClick={() => setShowIncidentModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/15 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="btn-submit-incident"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-semibold hover:from-rose-400 hover:to-red-500 transition shadow-lg shadow-rose-500/20"
                  >
                    File Live Dispatch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
