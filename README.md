# Nusa-Onko AI Radioterapi Starter

Starter aplikasi web radioterapi terintegrasi dengan 10 modul AI (mock/rule-based) yang sudah end-to-end:
input → validasi → inferensi dummy → output hasil + severity → history → save ke patient context → auto alert.

## Fitur yang tersedia
- Patients List & Patient Detail (overview, hasil modul, alerts, timeline)
- Modules Overview + halaman detail setiap modul
- Alerts Center
- Reports page
- 10 modul inti: AUTOContour-One, Dose-Drift Detector, Mucositis-CAM, Pneumoshield, PlanPilot-VMAT, Setup-Error Zero, RT-DocWatch, Hippocampus-Saver AI, WaitList-Fair, LiverRILD-Guard
- Reusable components:
  - `PatientSelector`
  - `SeverityBadge`
  - `RiskScoreCard`
  - `ModuleHeader`
  - `AnalysisResultPanel`
  - `HistoryTable`
  - `AlertBanner`
  - `SaveResultDialog`
  - `ModuleFormSection`

## Struktur utama
- `src/pages/*`: halaman aplikasi
- `src/services/module-definitions.ts`: service layer + dummy inference semua modul
- `src/lib/rt-store.tsx`: state management terpusat
- `src/components/rt/reusable.tsx`: reusable UI components
- `src/types/ai-modules.ts`: reusable type/interface
- `src/modules/<module-key>/index.ts`: module folder scaffold
- `prisma/schema.prisma`: dummy PostgreSQL schema
- `backend/src/server.js`: mock Express API endpoint

## Menjalankan frontend
```bash
npm run dev
```

## Mock API backend (template)
```bash
node backend/src/server.js
```

## Catatan
- Inferensi saat ini masih rule-based/dummy agar cepat diuji.
- Service layer sudah dipisah sehingga mudah diganti ke Python AI service / REST inference API / model serving.
