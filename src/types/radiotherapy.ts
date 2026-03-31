export type RoleName = 'Admin' | 'Radiation Oncologist' | 'Medical Physicist' | 'Radiation Therapist / RTT' | 'Researcher';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ModuleStatus = 'Idea' | 'In Review' | 'Active';

export interface Role {
  id: string;
  name: RoleName;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

export interface Diagnosis {
  cancerSite: string;
  stage: string;
  histology: string;
  intent: 'Curative' | 'Palliative';
}

export interface ImagingStudy {
  id: string;
  patientId: string;
  type: 'CT-Sim' | 'CBCT' | 'MRI' | 'Portal Imaging' | 'Intraoral Photo';
  date: string;
  metadata: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  technique: 'VMAT' | 'IMRT' | 'SBRT';
  totalDoseGy: number;
  fractions: number;
  machine: string;
  status: 'Draft' | 'Approved' | 'On Treatment' | 'Completed';
}

export interface FractionRecord {
  id: string;
  patientId: string;
  fractionNo: number;
  cbctShiftMm: number;
  completedAt: string;
}

export interface ToxicityAssessment {
  id: string;
  patientId: string;
  date: string;
  toxicityType: 'Mucositis' | 'Pneumonitis' | 'RILD' | 'Cognitive Decline';
  grade: number;
}

export interface DocumentAudit {
  id: string;
  patientId: string;
  date: string;
  status: 'Pass' | 'Warning' | 'Critical';
  issues: string[];
}

export interface AIModelResult {
  id: string;
  patientId: string;
  moduleKey: string;
  moduleName: string;
  status: ModuleStatus;
  riskScore: number;
  confidence: number;
  severity: SeverityLevel;
  summary: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  patientId: string;
  title: string;
  message: string;
  category: string;
  severity: SeverityLevel;
  createdAt: string;
  acknowledged: boolean;
}

export interface WaitListScore {
  id: string;
  patientId: string;
  urgencyScore: number;
  progressionRisk: number;
  machineConstraint: string;
  recommendation: string;
}

export interface FollowUpOutcome {
  id: string;
  patientId: string;
  date: string;
  endpoint: string;
  value: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  diagnosis: Diagnosis;
  regimen: string;
  treatmentStart: string;
  treatmentEnd: string;
  therapyStatus: 'Simulation' | 'Planning' | 'Treatment' | 'Follow-up';
}

export interface RadiotherapyDataset {
  roles: Role[];
  users: User[];
  patients: Patient[];
  imagingStudies: ImagingStudy[];
  treatmentPlans: TreatmentPlan[];
  fractionRecords: FractionRecord[];
  toxicityAssessments: ToxicityAssessment[];
  documentAudits: DocumentAudit[];
  aiResults: AIModelResult[];
  notifications: Notification[];
  waitListScores: WaitListScore[];
  followUpOutcomes: FollowUpOutcome[];
}
