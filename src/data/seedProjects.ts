import { Project } from '@/types/project';

const now = new Date().toISOString();

export const seedProjects: Project[] = [
  ['AutoContour-One','AI Auto-segmentation Target dan OAR untuk Mempercepat Proses Konturing','Segmentation'],
  ['Dose-Drift Detector','AI Berbasis CBCT Harian untuk Deteksi Perubahan Anatomi dan Pemicu Adaptive Replanning','Adaptive RT'],
  ['Mucositis-Cam','Prediksi Mukositis Berat Menggunakan Foto Intraoral Serial dan Informasi Distribusi Dosis','Toxicity Prediction'],
  ['PneumoShield','Prediksi Pneumonitis Radiasi pada Kanker Paru Menggunakan CT Radiomics dan Parameter Dose-Volume','Toxicity Prediction'],
  ['PlanPilot-VMAT','Perencanaan VMAT Berbasis AI vs Perencanaan Manual (Studi Non-inferiority)','Treatment Planning'],
  ['Setup-Error Zero','AI Deteksi dan Rekomendasi Koreksi Setup Real-time dari Portal Imaging/CBCT','Setup Verification'],
  ['RT-DocWatch','Audit Konsistensi Dokumen Radioterapi Menggunakan LLM untuk Pencegahan Error Laterality/Dose/Fraction','Document Audit'],
  ['Hippocampus-Saver AI','Prediksi Penurunan Fungsi Kognitif Pasca WBRT Berbasis MRI Radiomics dan Dosis ke Hippocampus','Cognitive Outcome'],
  ['WaitList-Fair','Prioritisasi Jadwal Radioterapi Berbasis AI untuk Meminimalkan Risiko Progresi Saat Menunggu','Scheduling'],
  ['LiverRILD-Guard','Prediksi Radiation-Induced Liver Disease pada SBRT Hati Menggunakan Cadangan Fungsi Hati dan Heterogenitas Dosis','Liver Toxicity']
].map(([title, shortDescription, category], idx) => ({
  id: crypto.randomUUID(),
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  shortDescription,
  fullDescription: `${shortDescription}. Fokus proyek mencakup validasi klinis, evaluasi workflow, dan readiness implementasi di lingkungan radioterapi.`,
  category: category as Project['category'],
  status: idx % 3 === 0 ? 'Active' : idx % 3 === 1 ? 'In Review' : 'Idea',
  priority: idx < 3 ? 'Critical' : idx < 6 ? 'High' : 'Medium',
  tags: ['AI', 'Radioterapi', 'Nusa Onko'],
  createdAt: now,
  updatedAt: now,
  favorite: idx < 3
}));
