import { AiModule } from '@/types/module';

const now = new Date().toISOString();

const modules: Array<[string, string]> = [
  ['AutoContour-One', 'AI Auto-segmentation Target dan OAR untuk Mempercepat Proses Konturing'],
  ['Dose-Drift Detector', 'AI Berbasis CBCT Harian untuk Deteksi Perubahan Anatomi dan Pemicu Adaptive Replanning'],
  ['Mucositis-Cam', 'Prediksi Mukositis Berat Menggunakan Foto Intraoral Serial dan Informasi Distribusi Dosis'],
  ['PneumoShield', 'Prediksi Pneumonitis Radiasi pada Kanker Paru Menggunakan CT Radiomics dan Parameter Dose-Volume'],
  ['PlanPilot-VMAT', 'Perencanaan VMAT Berbasis AI vs Perencanaan Manual (Studi Non-inferiority)'],
  ['Setup-Error Zero', 'AI Deteksi dan Rekomendasi Koreksi Setup Real-time dari Portal Imaging/CBCT'],
  ['RT-DocWatch', 'Audit Konsistensi Dokumen Radioterapi Menggunakan LLM untuk Pencegahan Error Laterality/Dose/Fraction'],
  ['Hippocampus-Saver AI', 'Prediksi Penurunan Fungsi Kognitif Pasca WBRT Berbasis MRI Radiomics dan Dosis ke Hippocampus'],
  ['WaitList-Fair', 'Prioritisasi Jadwal Radioterapi Berbasis AI untuk Meminimalkan Risiko Progresi Saat Menunggu'],
  ['LiverRILD-Guard', 'Prediksi Radiation-Induced Liver Disease pada SBRT Hati Menggunakan Cadangan Fungsi Hati dan Heterogenitas Dosis']
];

export const seedModules: AiModule[] = modules.map(([name, summary], idx) => ({
  id: crypto.randomUUID(),
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  summary,
  details: `${summary}. Modul mendukung lifecycle CRUD untuk kebutuhan dokumentasi, evaluasi, dan implementasi klinis.`,
  status: idx < 2 ? 'Production' : idx < 5 ? 'Validated' : idx < 8 ? 'Pilot' : 'Draft',
  priority: idx < 3 ? 'Critical' : idx < 7 ? 'High' : 'Medium',
  owner: 'Tim AI Radioterapi',
  tags: ['AI', 'Radioterapi', 'Modul Klinis'],
  createdAt: now,
  updatedAt: now
}));
