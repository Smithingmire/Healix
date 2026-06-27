export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface Resource {
  name: string;
  type: "Hospital" | "PHC" | "Emergency" | "Ambulance";
  address: string;
  phone: string;
  distance: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  symptoms: string;
  analysis: string;
}

export interface HealthLog {
  id: string;
  date: string;
  category: "fever" | "pain" | "cough" | "other";
  notes: string;
  severity: "low" | "medium" | "high";
}

export interface UserSession {
  _id?: string;
  name: string;
  phone: string;
  pincode: string;
  age: number;
  gender: string;
  location: string;
  language: string;
  email?: string;
  password?: string;
  latitude?: number;
  longitude?: number;
  pastDiseases?: any[];
  medicalReports?: any[];
  medications?: any[];
  coreVitals?: {
    bloodGroup: string;
    allergies: string;
    height: string;
    weight: string;
    chronicConditions: string;
  };
  chatSessions?: any[];
  activeSessionId?: string | null;
  misinfoHistory?: any[];
}


