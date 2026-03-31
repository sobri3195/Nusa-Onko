import { ModuleDefinition, Severity } from '@/types/ai-modules';

const now = () => new Date().toISOString();
const clamp = (value: number) => Math.max(0, Math.min(100, value));
const sevFromScore = (s: number): Severity => (s >= 80 ? 'critical' : s >= 60 ? 'high' : s >= 35 ? 'moderate' : 'low');

const build = (score: number, summary: string, recommendation: string, output: Record<string, unknown>) => ({
  score,
  severity: sevFromScore(score),
  summary,
  recommendation,
  generatedAt: now(),
  output,
});

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: 'autocontour-one',
    name: 'AUTOContour-One',
    purpose: 'Auto-segmentation target dan OAR',
    severityField: 'contourStatus',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true },
      { name: 'imagingStudyId', label: 'Imaging Study ID', type: 'text', required: true },
      { name: 'cancerSite', label: 'Cancer Site', type: 'select', options: ['Head Neck', 'Thorax', 'Pelvis', 'CNS'], required: true },
      { name: 'targetStructures', label: 'Target Structures (comma)', type: 'text', required: true },
      { name: 'oarStructures', label: 'OAR Structures (comma)', type: 'text', required: true },
    ],
    run: (p) => {
      const targets = String(p.targetStructures).split(',').filter(Boolean);
      const oars = String(p.oarStructures).split(',').filter(Boolean);
      const total = targets.length + oars.length;
      const complexity = ['Head Neck', 'Thorax'].includes(String(p.cancerSite)) ? 12 : 4;
      const score = clamp(30 + total * 8 + complexity);
      const status = score > 70 ? 'needs review' : 'accepted';
      return build(score, `Segmentasi ${total} struktur selesai`, status === 'accepted' ? 'Lanjutkan planning review.' : 'Butuh verifikasi dokter.', {
        segmentedStructures: [...targets, ...oars],
        confidenceScore: clamp(92 - total * 3 - complexity / 2),
        contourStatus: status,
        reviewerNote: status === 'accepted' ? 'Auto OK' : 'Periksa batas target kompleks',
        estimatedContourTimeSaved: `${Math.max(10, 60 - total * 4)} menit`,
      });
    },
  },
  {
    key: 'dose-drift-detector',
    name: 'DOSE-DRIFT DETECTOR',
    purpose: 'Deteksi drift anatomi harian',
    severityField: 'driftLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true },
      { name: 'planningStudyId', label: 'Planning Study ID', type: 'text', required: true },
      { name: 'dailyCbctId', label: 'Daily CBCT ID', type: 'text', required: true },
      { name: 'bodyWeightChange', label: 'Body Weight Change (%)', type: 'number', required: true },
      { name: 'tumorShiftMm', label: 'Tumor Shift (mm)', type: 'number', required: true },
      { name: 'organVolumeChangePercent', label: 'Organ Volume Change (%)', type: 'number', required: true },
      { name: 'setupDeviationMm', label: 'Setup Deviation (mm)', type: 'number', required: true },
    ],
    run: (p) => {
      const score = clamp(Number(p.tumorShiftMm) * 5 + Number(p.organVolumeChangePercent) * 1.5 + Number(p.setupDeviationMm) * 3 + Math.abs(Number(p.bodyWeightChange)) * 2);
      const level = sevFromScore(score);
      return build(score, `Drift level ${level}`, score >= 60 ? 'Review adaptive replanning' : score >= 35 ? 'Monitor closely' : 'Continue treatment', {
        driftScore: score,
        driftLevel: level,
        requiresAdaptiveReview: score >= 60,
        summaryText: `Shift tumor ${p.tumorShiftMm} mm dan perubahan organ ${p.organVolumeChangePercent}%`,
      });
    },
  },
  {
    key: 'mucositis-cam', name: 'MUCOSITIS-CAM', purpose: 'Prediksi risiko mukositis', severityField: 'mucositisRiskLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'visitDate', label: 'Visit Date', type: 'date', required: true },
      { name: 'fractionNumber', label: 'Fraction', type: 'number', required: true }, { name: 'oralDoseMean', label: 'Oral Dose Mean', type: 'number', required: true },
      { name: 'oralDoseMax', label: 'Oral Dose Max', type: 'number', required: true }, { name: 'painScore', label: 'Pain Score', type: 'number', required: true }, { name: 'imageUpload', label: 'Image Ref', type: 'text', required: true },
    ],
    run: (p, h) => {
      const score = clamp(Number(p.oralDoseMean) * 1.2 + Number(p.oralDoseMax) * 0.7 + Number(p.painScore) * 8 + Number(p.fractionNumber));
      const prev = h.length ? h[h.length - 1].score : score;
      return build(score, 'Risiko mukositis serial dianalisis', score > prev ? 'Early intervention oral care' : 'Lanjutkan monitoring', {
        mucositisRiskScore: score,
        mucositisRiskLevel: sevFromScore(score),
        suggestedAction: score >= 60 ? 'Intervensi dini' : 'Kontrol rutin',
        progressionTrend: score > prev ? 'worsening' : 'stable',
        comparisonWithPrevious: score - prev,
      });
    },
  },
  {
    key: 'pneumoshield', name: 'PNEUMOSHIELD', purpose: 'Prediksi pneumonitis', severityField: 'pneumonitisRiskLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'lungMeanDose', label: 'Lung Mean Dose', type: 'number', required: true },
      { name: 'lungV20', label: 'Lung V20', type: 'number', required: true }, { name: 'lungV5', label: 'Lung V5', type: 'number', required: true },
      { name: 'radiomicsScore', label: 'Radiomics Score', type: 'number', required: true }, { name: 'smokingHistory', label: 'Smoking History', type: 'select', options: ['none', 'former', 'active'], required: true },
      { name: 'baselineLungDisease', label: 'Baseline Lung Disease', type: 'select', options: ['no', 'yes'], required: true },
    ],
    run: (p) => {
      const smoke = p.smokingHistory === 'active' ? 12 : p.smokingHistory === 'former' ? 6 : 0;
      const disease = p.baselineLungDisease === 'yes' ? 14 : 0;
      const score = clamp(Number(p.lungMeanDose) * 1.5 + Number(p.lungV20) + Number(p.radiomicsScore) * 0.9 + smoke + disease);
      return build(score, 'Risiko pneumonitis dihitung dari DVH+radiomics', score >= 60 ? 'Follow-up ketat minggu awal' : 'Follow-up standar', {
        pneumonitisRiskScore: score,
        pneumonitisRiskLevel: sevFromScore(score),
        topRiskFactors: ['lungMeanDose', 'lungV20', p.baselineLungDisease === 'yes' ? 'baselineLungDisease' : 'radiomicsScore'],
      });
    },
  },
  {
    key: 'planpilot-vmat', name: 'PLANPILOT-VMAT', purpose: 'Evaluasi kualitas plan VMAT', severityField: 'planQualityLabel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'ptvCoverage', label: 'PTV Coverage (%)', type: 'number', required: true },
      { name: 'conformityIndex', label: 'Conformity Index', type: 'number', required: true }, { name: 'homogeneityIndex', label: 'Homogeneity Index', type: 'number', required: true },
      { name: 'oarConstraintPassRate', label: 'OAR Pass Rate (%)', type: 'number', required: true }, { name: 'estimatedPlanningTime', label: 'Planning Time (min)', type: 'number', required: true },
      { name: 'planType', label: 'Plan Type', type: 'select', options: ['manual', 'ai-assisted'], required: true },
    ],
    run: (p) => {
      const score = clamp(Number(p.ptvCoverage) * 0.4 + Number(p.oarConstraintPassRate) * 0.45 + (2 - Number(p.homogeneityIndex)) * 15 + (1.2 - Number(p.conformityIndex)) * 10 + (p.planType === 'ai-assisted' ? 4 : 0));
      return build(100 - score, 'Quality label dihitung dari metrik dosimetri', score < 35 ? 'Acceptable' : 'Review optimization', {
        planQualityScore: 100 - score,
        planQualityLabel: score < 25 ? 'acceptable' : score < 40 ? 'review' : 'suboptimal',
        strengths: ['PTV coverage', 'OAR pass rate'],
        weaknesses: score > 40 ? ['Conformity/Homogeneity'] : [],
      });
    },
  },
  {
    key: 'setup-error-zero', name: 'SETUP-ERROR ZERO', purpose: 'Deteksi deviasi setup', severityField: 'setupSeverity',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'fractionNumber', label: 'Fraction', type: 'number', required: true },
      { name: 'shiftX', label: 'Shift X', type: 'number', required: true }, { name: 'shiftY', label: 'Shift Y', type: 'number', required: true }, { name: 'shiftZ', label: 'Shift Z', type: 'number', required: true },
      { name: 'rotationPitch', label: 'Pitch', type: 'number', required: true }, { name: 'rotationRoll', label: 'Roll', type: 'number', required: true }, { name: 'rotationYaw', label: 'Yaw', type: 'number', required: true },
    ],
    run: (p) => {
      const trans = Math.abs(Number(p.shiftX)) + Math.abs(Number(p.shiftY)) + Math.abs(Number(p.shiftZ));
      const rot = Math.abs(Number(p.rotationPitch)) + Math.abs(Number(p.rotationRoll)) + Math.abs(Number(p.rotationYaw));
      const score = clamp(trans * 6 + rot * 8);
      return build(score, 'Deviasi setup real-time', score >= 60 ? 'Reposisi pasien' : 'Koreksi couch shift', {
        setupErrorScore: score,
        setupSeverity: sevFromScore(score),
        correctionRecommendation: `Shift ${(-Number(p.shiftX)).toFixed(1)}, ${(-Number(p.shiftY)).toFixed(1)}, ${(-Number(p.shiftZ)).toFixed(1)} mm`,
        proceedStatus: score >= 75 ? 'hold - reposition required' : 'proceed with correction',
      });
    },
  },
  {
    key: 'rt-docwatch', name: 'RT-DOCWATCH', purpose: 'Audit konsistensi dokumen', severityField: 'severityLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'simulationNote', label: 'Simulation Note', type: 'textarea', required: true },
      { name: 'prescriptionText', label: 'Prescription', type: 'textarea', required: true }, { name: 'treatmentPlanText', label: 'Treatment Plan', type: 'textarea', required: true },
      { name: 'verificationText', label: 'Verification', type: 'textarea', required: true },
    ],
    run: (p) => {
      const text = [p.simulationNote, p.prescriptionText, p.treatmentPlanText, p.verificationText].map(String);
      const mismatch: string[] = [];
      if (text.some((x) => x.includes('left')) && text.some((x) => x.includes('right'))) mismatch.push('Laterality mismatch');
      if (text.filter((x) => x.match(/\d+\s*gy/i)).length < 4) mismatch.push('Dose inconsistency');
      const score = clamp(mismatch.length * 35);
      return build(score, 'Audit dokumen selesai', mismatch.length ? 'Perlu manual review' : 'Dokumen konsisten', {
        consistencyScore: 100 - score,
        mismatchItems: mismatch,
        severityLevel: mismatch.includes('Laterality mismatch') ? 'critical' : sevFromScore(score),
        summaryAudit: mismatch.length ? `${mismatch.length} mismatch` : 'No mismatch',
        requiresManualReview: mismatch.length > 0,
      });
    },
  },
  {
    key: 'hippocampus-saver', name: 'HIPPOCAMPUS-SAVER AI', purpose: 'Prediksi cognitive decline', severityField: 'cognitiveDeclineRiskLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'hippocampalDoseMean', label: 'Hippocampal Dose Mean', type: 'number', required: true },
      { name: 'hippocampalDoseMax', label: 'Hippocampal Dose Max', type: 'number', required: true }, { name: 'mriRadiomicsScore', label: 'MRI Radiomics', type: 'number', required: true },
      { name: 'age', label: 'Age', type: 'number', required: true }, { name: 'baselineCognitiveScore', label: 'Baseline Cognitive Score', type: 'number', required: true },
    ],
    run: (p) => {
      const score = clamp(Number(p.hippocampalDoseMean) * 1.4 + Number(p.hippocampalDoseMax) * 0.8 + Number(p.mriRadiomicsScore) + Number(p.age) * 0.4 + (100 - Number(p.baselineCognitiveScore)) * 0.7);
      return build(score, 'Risiko neurokognitif pasca WBRT', score >= 60 ? 'Follow-up neurokognitif 4-6 minggu' : 'Follow-up rutin', {
        cognitiveDeclineRiskScore: score,
        cognitiveDeclineRiskLevel: sevFromScore(score),
        followUpSuggestion: score >= 60 ? 'Konsul neuropsikologi' : 'Observasi berkala',
      });
    },
  },
  {
    key: 'waitlist-fair', name: 'WAITLIST-FAIR', purpose: 'Prioritisasi antrean RT', severityField: 'priorityLabel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'diagnosis', label: 'Diagnosis', type: 'text', required: true },
      { name: 'urgencyLevel', label: 'Urgency (1-5)', type: 'number', required: true }, { name: 'waitingDays', label: 'Waiting Days', type: 'number', required: true },
      { name: 'symptomBurden', label: 'Symptom Burden (1-10)', type: 'number', required: true }, { name: 'cancerAggressiveness', label: 'Aggressiveness (1-10)', type: 'number', required: true },
      { name: 'machineAvailabilityConstraint', label: 'Machine Constraint', type: 'number', required: true },
    ],
    run: (p) => {
      const score = clamp(Number(p.urgencyLevel) * 12 + Number(p.waitingDays) * 0.8 + Number(p.symptomBurden) * 5 + Number(p.cancerAggressiveness) * 4 + Number(p.machineAvailabilityConstraint) * 3);
      return build(score, 'Prioritas waitlist dihitung', 'Jadwalkan sesuai rank terbaru', {
        waitListPriorityScore: score,
        priorityRank: Math.max(1, Math.round((100 - score) / 10)),
        priorityLabel: score > 70 ? 'expedite' : score > 45 ? 'priority' : 'standard',
        rationaleText: 'Urgency + waiting days + symptom burden dominan',
      });
    },
  },
  {
    key: 'liverrild-guard', name: 'LIVERRILD-GUARD', purpose: 'Prediksi risiko RILD', severityField: 'rildRiskLevel',
    fields: [
      { name: 'patientId', label: 'Patient', type: 'select', required: true }, { name: 'childPughClass', label: 'Child Pugh', type: 'select', options: ['A', 'B', 'C'], required: true },
      { name: 'albumin', label: 'Albumin', type: 'number', required: true }, { name: 'bilirubin', label: 'Bilirubin', type: 'number', required: true },
      { name: 'liverMeanDose', label: 'Liver Mean Dose', type: 'number', required: true }, { name: 'doseHeterogeneityScore', label: 'Dose Heterogeneity', type: 'number', required: true },
      { name: 'normalLiverVolume', label: 'Normal Liver Volume', type: 'number', required: true },
    ],
    run: (p) => {
      const child = p.childPughClass === 'C' ? 30 : p.childPughClass === 'B' ? 20 : 8;
      const score = clamp(child + Number(p.bilirubin) * 10 + Number(p.liverMeanDose) * 1.2 + Number(p.doseHeterogeneityScore) * 3 + (500 - Number(p.normalLiverVolume)) * 0.05 - Number(p.albumin) * 4);
      return build(score, 'Prediksi RILD selesai', score >= 60 ? 'Warning: monitoring ketat dan evaluasi hepatologi' : 'Monitoring standar fungsi hati', {
        rildRiskScore: score,
        rildRiskLevel: sevFromScore(score),
        clinicalWarning: score >= 60 ? 'High risk RILD' : 'Controlled risk',
        monitoringPlan: score >= 60 ? 'LFT weekly' : 'LFT biweekly',
      });
    },
  },
];

export const MODULE_MAP = Object.fromEntries(MODULE_DEFINITIONS.map((mod) => [mod.key, mod]));
