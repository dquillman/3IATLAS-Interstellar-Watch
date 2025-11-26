export enum ConfidenceLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Confirmed = 'Confirmed',
}

export enum AnomalyStatus {
  Normal = 'Normal',
  Watch = 'Watch',
  Alert = 'Alert',
  Confirmed = 'Confirmed',
  UnderInvestigation = 'Under Investigation',
}

export enum FutureStatus {
  Planned = 'Planned',
  Scheduled = 'Scheduled',
  Opportunity = 'Opportunity',
}

export interface SummaryData {
  lastUpdateTimestamp: string;
  currentPhase: 'Pre-Perihelion' | 'Perihelion' | 'Post-Perihelion';
  isNatural: {
    status: boolean;
    note: string;
  };
  maneuverEvidence: {
    status: boolean;
    note: string;
  };
  threatLevel: 'Nominal' | 'Elevated' | 'High' | 'Critical';
  threatLevelReason: string;
  assessment: string;
}

export interface Observation {
  id: number;
  dateObserved: string;
  observatory: string;
  observationType: string;
  keyFinding: string;
  confidence: ConfidenceLevel;
}

export interface Anomaly {
  id: number;
  name: string;
  description: string;
  status: AnomalyStatus;
}

export interface FutureObservation {
  id: number;
  mission: string;
  objective: string;
  windowStart: string;
  windowEnd: string;
  status: FutureStatus;
}