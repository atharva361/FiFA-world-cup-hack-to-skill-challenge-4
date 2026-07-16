import { Stadium, IncidentReport, Volunteer, OperationsMetrics } from "./types";

export const STADIUMS: Stadium[] = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    location: "New York / New Jersey, USA",
    capacity: 82500,
    capacityStr: "82,500",
    matches: [
      "Match 12: Group Stage",
      "Match 24: Group Stage",
      "Match 45: Round of 32",
      "Match 74: Quarter-final",
      "Match 104: World Cup Final (July 19, 2026)"
    ],
    gates: [
      { name: "Gate A (MetLife Gate)", status: "Open - Clear", waitMinutes: 5, accessibilityFriendly: true, type: "General" },
      { name: "Gate B (Verizon Gate)", status: "Open - Busy", waitMinutes: 18, accessibilityFriendly: true, type: "General" },
      { name: "Gate C (HCLTech Gate)", status: "Open - Congested", waitMinutes: 35, accessibilityFriendly: false, type: "General" },
      { name: "Gate D (Pepsi Gate)", status: "Open - Clear", waitMinutes: 8, accessibilityFriendly: true, type: "Accessible" },
      { name: "Gate VIP West", status: "Open - Clear", waitMinutes: 2, accessibilityFriendly: true, type: "VIP" },
      { name: "Press Entry Gate", status: "Open - Clear", waitMinutes: 4, accessibilityFriendly: true, type: "Press" }
    ],
    transitHubs: [
      { name: "Meadowlands Station (Train)", type: "Train", status: "On Time", frequency: "Every 10 mins", distance: "200m" },
      { name: "Lot G Shuttle Bus Loop", type: "Bus Shuttle", status: "Slight Delay", frequency: "Every 8 mins", distance: "400m" },
      { name: "West Rideshare Zone (Uber/Lyft)", type: "Rideshare", status: "High Crowd Wait", frequency: "On Demand", distance: "600m" },
      { name: "Premium Green Lot (EV Only)", type: "Parking Lot", status: "On Time", frequency: "N/A", distance: "150m" }
    ],
    coordinates: { x: 400, y: 300 }
  },
  {
    id: "azteca",
    name: "Estadio Azteca",
    location: "Mexico City, Mexico",
    capacity: 87523,
    capacityStr: "87,520",
    matches: [
      "Match 1: Opening Match (June 11, 2026)",
      "Match 15: Group Stage",
      "Match 39: Round of 32",
      "Match 68: Round of 16",
      "Match 92: Semi-final"
    ],
    gates: [
      { name: "Acceso Principal 1", status: "Open - Busy", waitMinutes: 22, accessibilityFriendly: true, type: "General" },
      { name: "Acceso Norte 3", status: "Open - Congested", waitMinutes: 40, accessibilityFriendly: false, type: "General" },
      { name: "Acceso Preferencial Sur", status: "Open - Clear", waitMinutes: 10, accessibilityFriendly: true, type: "Accessible" },
      { name: "Palco VIP Especial", status: "Open - Clear", waitMinutes: 3, accessibilityFriendly: true, type: "VIP" }
    ],
    transitHubs: [
      { name: "Estación Estadio Azteca (Light Rail)", type: "Train", status: "On Time", frequency: "Every 5 mins", distance: "100m" },
      { name: "Tlalpan Bus Rapid Transit (BRT)", type: "Bus Shuttle", status: "On Time", frequency: "Every 4 mins", distance: "300m" },
      { name: "Taxi Seguro Azteca", type: "Rideshare", status: "On Time", frequency: "Continuous", distance: "250m" }
    ],
    coordinates: { x: 450, y: 350 }
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    location: "Los Angeles, California, USA",
    capacity: 70240,
    capacityStr: "70,240",
    matches: [
      "Match 4: USMNT Opening Match (June 12, 2026)",
      "Match 18: Group Stage",
      "Match 52: Round of 32",
      "Match 85: Quarter-final",
      "Match 101: Third-Place Match"
    ],
    gates: [
      { name: "Gate 1 (American Airlines Plaza)", status: "Open - Clear", waitMinutes: 6, accessibilityFriendly: true, type: "General" },
      { name: "Gate 4 (Rams / Chargers Entry)", status: "Open - Busy", waitMinutes: 15, accessibilityFriendly: true, type: "General" },
      { name: "Gate 8 (South Entry)", status: "Open - Congested", waitMinutes: 30, accessibilityFriendly: false, type: "General" },
      { name: "Gate VIP Champions", status: "Open - Clear", waitMinutes: 1, accessibilityFriendly: true, type: "VIP" }
    ],
    transitHubs: [
      { name: "Metro K-Line (Downtown Inglewood)", type: "Train", status: "Slight Delay", frequency: "Every 12 mins", distance: "1.2km" },
      { name: "SoFi Stadium Express Bus", type: "Bus Shuttle", status: "On Time", frequency: "Every 6 mins", distance: "100m" },
      { name: "Pink Lot EV Charger Hub", type: "Parking Lot", status: "On Time", frequency: "N/A", distance: "200m" }
    ],
    coordinates: { x: 380, y: 280 }
  }
];

export const INITIAL_METRICS: Record<string, OperationsMetrics> = {
  metlife: {
    crowdLoad: 78,
    openGates: 5,
    queueTime: 16,
    weather: "Clear, 24°C, Wind: 8km/h NW",
    incidentCount: 2,
    carbonSavedKg: 14520,
    wasteRecycledPercent: 92.4
  },
  azteca: {
    crowdLoad: 91,
    openGates: 4,
    queueTime: 25,
    weather: "Sunny, 28°C, Wind: 12km/h S",
    incidentCount: 4,
    carbonSavedKg: 18450,
    wasteRecycledPercent: 88.1
  },
  sofi: {
    crowdLoad: 64,
    openGates: 4,
    queueTime: 12,
    weather: "Mild, 21°C (Indoor Canopy Enclosure)",
    incidentCount: 1,
    carbonSavedKg: 12100,
    wasteRecycledPercent: 95.6
  }
};

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: "INC-101",
    location: "MetLife Stadium - Gate B Concourse",
    type: "Medical",
    severity: "High",
    status: "Dispatching",
    reportedAt: "06:12 AM",
    assignedTeam: "Medical Unit 3"
  },
  {
    id: "INC-102",
    location: "MetLife Stadium - Parking Lot J (EV Zone)",
    type: "Facilities",
    severity: "Low",
    status: "On-Scene",
    reportedAt: "05:45 AM",
    assignedTeam: "Maintenance Crew A"
  },
  {
    id: "INC-103",
    location: "Estadio Azteca - General Access Tunnel 4",
    type: "Crowd Control",
    severity: "Critical",
    status: "On-Scene",
    reportedAt: "06:20 AM",
    assignedTeam: "Security Platoon B"
  },
  {
    id: "INC-104",
    location: "SoFi Stadium - Section 112 Wheelchair Deck",
    type: "Facilities",
    severity: "Medium",
    status: "Resolved",
    reportedAt: "04:30 AM",
    assignedTeam: "Accessibility Host Team"
  }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: "VOL-701", name: "Gabriela Rodriguez", role: "Multilingual Guest Relations", assignedGate: "Gate A (MetLife Gate)", status: "Active", rating: 4.9 },
  { id: "VOL-702", name: "Marcus Thorne", role: "Accessibility Access escort", assignedGate: "Gate D (Pepsi Gate)", status: "Active", rating: 4.8 },
  { id: "VOL-703", name: "Yuki Tanaka", role: "Transit Wayfinder Coordinator", assignedGate: "Meadowlands Station Train Hub", status: "On Break", rating: 5.0 },
  { id: "VOL-704", name: "Mateo Garcia", role: "Green Arena Recycling Usher", assignedGate: "Lot G Shuttle Bus Loop", status: "Active", rating: 4.7 }
];

export const LANGUAGES = [
  { code: "en", name: "English 🇺🇸" },
  { code: "es", name: "Español 🇲🇽" },
  { code: "fr", name: "Français 🇫🇷" },
  { code: "pt", name: "Português 🇧🇷" },
  { code: "de", name: "Deutsch 🇩🇪" },
  { code: "ar", name: "العربية 🇸🇦" }
];
