export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Stadium {
  id: string;
  name: string;
  location: string;
  capacity: number;
  capacityStr: string;
  matches: string[];
  gates: StadiumGate[];
  transitHubs: TransitHub[];
  coordinates: { x: number; y: number };
}

export interface StadiumGate {
  name: string;
  status: "Open - Clear" | "Open - Busy" | "Open - Congested" | "Closed";
  waitMinutes: number;
  accessibilityFriendly: boolean;
  type: "General" | "VIP" | "Press" | "Accessible";
}

export interface TransitHub {
  name: string;
  type: "Metro" | "Bus Shuttle" | "Train" | "Rideshare" | "Parking Lot";
  status: "On Time" | "Slight Delay" | "High Crowd Wait" | "Closed";
  frequency: string;
  distance: string;
}

export interface AIAction {
  title: string;
  severity: "Critical" | "High" | "Moderate" | "Info";
  desc: string;
  targetDept: string;
}

export interface OperationsMetrics {
  crowdLoad: number; // Percentage (e.g. 78%)
  openGates: number;
  queueTime: number; // Minutes
  weather: string;
  incidentCount: number;
  carbonSavedKg: number;
  wasteRecycledPercent: number;
}

export interface IncidentReport {
  id: string;
  location: string;
  type: "Medical" | "Security" | "Facilities" | "Crowd Control";
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Reported" | "Dispatching" | "On-Scene" | "Resolved";
  reportedAt: string;
  assignedTeam: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  assignedGate: string;
  status: "Active" | "On Break" | "Offline";
  rating: number;
}
