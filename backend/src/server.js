import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const modules = [
  { key: 'autocontour-one', name: 'AUTOContour-One', purpose: 'Auto-segmentation target dan OAR' },
  { key: 'dose-drift-detector', name: 'DOSE-DRIFT DETECTOR', purpose: 'Deteksi drift anatomi harian' },
  { key: 'mucositis-cam', name: 'MUCOSITIS-CAM', purpose: 'Prediksi risiko mukositis' },
  { key: 'pneumoshield', name: 'PNEUMOSHIELD', purpose: 'Prediksi pneumonitis' },
  { key: 'planpilot-vmat', name: 'PLANPILOT-VMAT', purpose: 'Evaluasi kualitas plan VMAT' },
  { key: 'setup-error-zero', name: 'SETUP-ERROR ZERO', purpose: 'Deteksi deviasi setup' },
  { key: 'rt-docwatch', name: 'RT-DOCWATCH', purpose: 'Audit konsistensi dokumen' },
  { key: 'hippocampus-saver', name: 'HIPPOCAMPUS-SAVER AI', purpose: 'Prediksi cognitive decline' },
  { key: 'waitlist-fair', name: 'WAITLIST-FAIR', purpose: 'Prioritisasi antrean RT' },
  { key: 'liverrild-guard', name: 'LIVERRILD-GUARD', purpose: 'Prediksi risiko RILD' },
];

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/api/modules', (_req, res) => res.json(modules));
app.post('/api/modules/:moduleKey/infer', (req, res) => {
  const mod = modules.find((m) => m.key === req.params.moduleKey);
  if (!mod) return res.status(404).json({ error: 'module not found' });
  const score = Math.min(100, Math.max(0, Math.round(Math.random() * 100)));
  const severity = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 35 ? 'moderate' : 'low';
  return res.json({ moduleKey: mod.key, result: { score, severity, summary: `Mock inference for ${mod.name}`, recommendation: severity === 'high' || severity === 'critical' ? 'Need urgent review' : 'Continue monitoring', generatedAt: new Date().toISOString(), output: req.body } });
});

app.listen(4000, () => console.log('Mock AI API running on :4000'));
