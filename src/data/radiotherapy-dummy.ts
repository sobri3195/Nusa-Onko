import { RadiotherapyDataset } from '@/types/radiotherapy';

export const aiModules = [
  'AutoContour-One',
  'Dose-Drift Detector',
  'Mucositis-Cam',
  'PneumoShield',
  'PlanPilot-VMAT',
  'Setup-Error Zero',
  'RT-DocWatch',
  'Hippocampus-Saver AI',
  'WaitList-Fair',
  'LiverRILD-Guard'
] as const;

export const radiotherapyData: RadiotherapyDataset = {
  roles: [
    { id: 'r1', name: 'Admin', permissions: ['*'] },
    { id: 'r2', name: 'Radiation Oncologist', permissions: ['patients.read', 'ai.review', 'alerts.manage'] },
    { id: 'r3', name: 'Medical Physicist', permissions: ['planning.manage', 'setup.review', 'drift.review'] },
    { id: 'r4', name: 'Radiation Therapist / RTT', permissions: ['fraction.record', 'setup.execute'] },
    { id: 'r5', name: 'Researcher', permissions: ['analytics.read', 'export.readonly'] }
  ],
  users: [
    { id: 'u1', name: 'Dr. Aulia', email: 'aulia@onko.id', roleId: 'r2' },
    { id: 'u2', name: 'Fis. Bima', email: 'bima@onko.id', roleId: 'r3' }
  ],
  patients: [
    {
      id: 'p1',
      mrn: 'MRN-24031',
      name: 'Rina Pratama',
      age: 48,
      gender: 'Female',
      diagnosis: { cancerSite: 'Nasopharynx', stage: 'III', histology: 'SCC', intent: 'Curative' },
      regimen: '70 Gy / 35 fx',
      treatmentStart: '2026-03-02',
      treatmentEnd: '2026-04-19',
      therapyStatus: 'Treatment'
    },
    {
      id: 'p2',
      mrn: 'MRN-24032',
      name: 'Adi Kurniawan',
      age: 63,
      gender: 'Male',
      diagnosis: { cancerSite: 'Lung', stage: 'IIIA', histology: 'Adenocarcinoma', intent: 'Curative' },
      regimen: '60 Gy / 30 fx',
      treatmentStart: '2026-03-10',
      treatmentEnd: '2026-04-24',
      therapyStatus: 'Planning'
    },
    {
      id: 'p3',
      mrn: 'MRN-24033',
      name: 'Siti Hamidah',
      age: 57,
      gender: 'Female',
      diagnosis: { cancerSite: 'Liver', stage: 'II', histology: 'HCC', intent: 'Curative' },
      regimen: '45 Gy / 5 fx',
      treatmentStart: '2026-04-05',
      treatmentEnd: '2026-04-19',
      therapyStatus: 'Simulation'
    }
  ],
  imagingStudies: [
    { id: 'im1', patientId: 'p1', type: 'CT-Sim', date: '2026-02-26', metadata: '2.5 mm slice, contrast' },
    { id: 'im2', patientId: 'p1', type: 'CBCT', date: '2026-03-30', metadata: 'fraction 20' },
    { id: 'im3', patientId: 'p2', type: 'CT-Sim', date: '2026-03-18', metadata: 'lung protocol' },
    { id: 'im4', patientId: 'p1', type: 'Intraoral Photo', date: '2026-03-29', metadata: 'serial day-19' },
    { id: 'im5', patientId: 'p3', type: 'MRI', date: '2026-03-27', metadata: 'WBRT cognition baseline' }
  ],
  treatmentPlans: [
    { id: 'tp1', patientId: 'p1', technique: 'VMAT', totalDoseGy: 70, fractions: 35, machine: 'Halcyon-1', status: 'On Treatment' },
    { id: 'tp2', patientId: 'p2', technique: 'VMAT', totalDoseGy: 60, fractions: 30, machine: 'TrueBeam-2', status: 'Draft' },
    { id: 'tp3', patientId: 'p3', technique: 'SBRT', totalDoseGy: 45, fractions: 5, machine: 'TrueBeam-1', status: 'Draft' }
  ],
  fractionRecords: [
    { id: 'f1', patientId: 'p1', fractionNo: 20, cbctShiftMm: 4.6, completedAt: '2026-03-30T08:02:00Z' },
    { id: 'f2', patientId: 'p1', fractionNo: 19, cbctShiftMm: 2.3, completedAt: '2026-03-29T08:06:00Z' }
  ],
  toxicityAssessments: [
    { id: 't1', patientId: 'p1', date: '2026-03-30', toxicityType: 'Mucositis', grade: 2 },
    { id: 't2', patientId: 'p2', date: '2026-03-27', toxicityType: 'Pneumonitis', grade: 1 }
  ],
  documentAudits: [
    { id: 'd1', patientId: 'p1', date: '2026-03-30', status: 'Warning', issues: ['Dose summary mismatch (69.8 vs 70 Gy)'] },
    { id: 'd2', patientId: 'p2', date: '2026-03-29', status: 'Critical', issues: ['Laterality mismatch in simulation report'] }
  ],
  aiResults: [
    { id: 'a1', patientId: 'p1', moduleKey: 'autocontour-one', moduleName: 'AutoContour-One', status: 'Active', riskScore: 0.12, confidence: 0.95, severity: 'Low', summary: 'CTV/OAR auto-segmentation accepted 94%.', timestamp: '2026-03-01T10:00:00Z' },
    { id: 'a2', patientId: 'p1', moduleKey: 'dose-drift-detector', moduleName: 'Dose-Drift Detector', status: 'Active', riskScore: 0.71, confidence: 0.88, severity: 'High', summary: 'Parotid displacement suggests adaptive replanning.', timestamp: '2026-03-30T08:15:00Z' },
    { id: 'a3', patientId: 'p1', moduleKey: 'mucositis-cam', moduleName: 'Mucositis-Cam', status: 'In Review', riskScore: 0.82, confidence: 0.79, severity: 'High', summary: 'High risk grade ≥3 mucositis in next 7 days.', timestamp: '2026-03-30T09:00:00Z' },
    { id: 'a4', patientId: 'p2', moduleKey: 'pneumoshield', moduleName: 'PneumoShield', status: 'Active', riskScore: 0.64, confidence: 0.86, severity: 'Medium', summary: 'Estimated symptomatic pneumonitis risk 18%.', timestamp: '2026-03-28T03:00:00Z' },
    { id: 'a5', patientId: 'p2', moduleKey: 'planpilot-vmat', moduleName: 'PlanPilot-VMAT', status: 'Active', riskScore: 0.22, confidence: 0.91, severity: 'Low', summary: 'AI VMAT meets non-inferiority target; reduced lung V20.', timestamp: '2026-03-26T11:20:00Z' },
    { id: 'a6', patientId: 'p1', moduleKey: 'setup-error-zero', moduleName: 'Setup-Error Zero', status: 'Active', riskScore: 0.77, confidence: 0.84, severity: 'High', summary: 'Recommended couch correction +3mm AP.', timestamp: '2026-03-30T08:05:00Z' },
    { id: 'a7', patientId: 'p2', moduleKey: 'rt-docwatch', moduleName: 'RT-DocWatch', status: 'Active', riskScore: 0.93, confidence: 0.9, severity: 'Critical', summary: 'Detected laterality inconsistency across forms.', timestamp: '2026-03-29T12:30:00Z' },
    { id: 'a8', patientId: 'p3', moduleKey: 'hippocampus-saver-ai', moduleName: 'Hippocampus-Saver AI', status: 'Idea', riskScore: 0.33, confidence: 0.7, severity: 'Medium', summary: 'Early prototype predicts moderate cognitive decline risk.', timestamp: '2026-03-27T07:20:00Z' },
    { id: 'a9', patientId: 'p3', moduleKey: 'waitlist-fair', moduleName: 'WaitList-Fair', status: 'Active', riskScore: 0.88, confidence: 0.89, severity: 'Critical', summary: 'Patient should be moved to top-3 machine queue.', timestamp: '2026-03-30T06:00:00Z' },
    { id: 'a10', patientId: 'p3', moduleKey: 'liverrild-guard', moduleName: 'LiverRILD-Guard', status: 'In Review', riskScore: 0.67, confidence: 0.81, severity: 'High', summary: 'High RILD risk due to Child-Pugh B + dose heterogeneity.', timestamp: '2026-03-30T07:40:00Z' }
  ],
  notifications: [
    { id: 'n1', patientId: 'p1', title: 'Adaptive replanning recommended', message: 'Dose drift exceeded threshold (8.2%).', category: 'Dose-Drift Detector', severity: 'High', createdAt: '2026-03-30T08:16:00Z', acknowledged: false },
    { id: 'n2', patientId: 'p2', title: 'Document conflict', message: 'Laterality mismatch detected by RT-DocWatch.', category: 'RT-DocWatch', severity: 'Critical', createdAt: '2026-03-29T12:32:00Z', acknowledged: false },
    { id: 'n3', patientId: 'p3', title: 'Waitlist priority', message: 'Progression risk high while waiting >12 days.', category: 'WaitList-Fair', severity: 'Critical', createdAt: '2026-03-30T06:05:00Z', acknowledged: true }
  ],
  waitListScores: [
    { id: 'w1', patientId: 'p2', urgencyScore: 76, progressionRisk: 0.58, machineConstraint: 'Lung VMAT slot full', recommendation: 'Allocate next available TrueBeam-2 PM slot.' },
    { id: 'w2', patientId: 'p3', urgencyScore: 91, progressionRisk: 0.82, machineConstraint: 'SBRT block availability', recommendation: 'Prioritize within 48 hours.' }
  ],
  followUpOutcomes: [
    { id: 'fo1', patientId: 'p1', date: '2026-03-30', endpoint: 'Weight loss', value: '4.3%' },
    { id: 'fo2', patientId: 'p2', date: '2026-03-27', endpoint: 'FEV1 change', value: '-6%' }
  ]
};
