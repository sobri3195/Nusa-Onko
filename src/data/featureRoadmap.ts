export type FeatureRoadmapItem = {
  title: string;
  summary: string;
  points: string[];
};

export const featureRoadmap: FeatureRoadmapItem[] = [
  {
    title: 'Kanban Board Interaktif',
    summary: 'Alur kerja visual drag-and-drop antar status Backlog, In Progress, dan Done.',
    points: [
      'Drag-and-drop antar status (Backlog, In Progress, Done).',
      'Membuat alur kerja lebih visual dan cepat dipahami.'
    ]
  },
  {
    title: 'Komentar & Kolaborasi Tim',
    summary: 'Thread diskusi per project dengan mention anggota tim dan notifikasi aktivitas.',
    points: [
      'Thread diskusi per project.',
      'Mention anggota tim dan notifikasi aktivitas.'
    ]
  },
  {
    title: 'Lampiran Dokumen Medis/Proposal',
    summary: 'Upload berkas penting dengan pratinjau langsung dari detail project.',
    points: [
      'Upload PDF, gambar, dan referensi jurnal.',
      'Pratinjau dokumen langsung dari detail project.'
    ]
  },
  {
    title: 'Reminder & Deadline Tracking',
    summary: 'Pengingat otomatis dan highlight proyek yang mendekati tenggat.',
    points: [
      'Pengingat tenggat otomatis.',
      'Highlight proyek yang mendekati deadline.'
    ]
  },
  {
    title: 'Dashboard Analitik',
    summary: 'Visualisasi tren kategori, prioritas, progres, dan insight aktivitas proyek.',
    points: [
      'Grafik tren kategori, prioritas, dan progres per periode.',
      'Insight proyek yang paling sering diubah/favorit.'
    ]
  },
  {
    title: 'Integrasi Ekspor Lanjutan',
    summary: 'Perluasan opsi ekspor untuk kebutuhan pelaporan lintas platform.',
    points: [
      'Ekspor ke CSV/Excel selain JSON.',
      'Integrasi ke Google Sheets untuk pelaporan.'
    ]
  },
  {
    title: 'AI Assistant untuk Project Brief',
    summary: 'Asisten AI untuk membantu ringkasan, risiko, dan rekomendasi prioritas.',
    points: [
      'Bantu generate ringkasan, risiko, dan next action.',
      'Saran prioritas berdasarkan data historis.'
    ]
  },
  {
    title: 'Template Project',
    summary: 'Template kategori untuk mempercepat input proyek berulang.',
    points: [
      'Template per kategori (Clinical, AI, Workflow).',
      'Mempercepat input data untuk proyek berulang.'
    ]
  },
  {
    title: 'Mode Presentasi',
    summary: 'Mode slideshow dari daftar proyek untuk rapat tim dan stakeholder.',
    points: [
      'Tampilan slideshow dari daftar project.',
      'Cocok untuk rapat tim dan stakeholder.'
    ]
  }
];
