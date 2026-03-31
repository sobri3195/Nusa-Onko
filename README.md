# Nusa Onko

Frontend prototype dashboard manajemen ide/proyek AI radioterapi.

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- shadcn-style UI components
- React Router
- localStorage only (tanpa backend/database)

## Menjalankan
```bash
npm install
npm run dev
```

## Capacitor (Android/iOS)
Jika muncul error saat `npx cap sync` seperti "Could not find the web assets directory", pastikan web assets sudah dibuild terlebih dahulu.

```bash
npm install
npm run cap:sync
```

Perintah `cap:sync` akan menjalankan build Vite (menghasilkan folder `dist/`) lalu sinkronisasi ke project native.

## Deploy Vercel
Project sudah kompatibel untuk deployment Vercel sebagai Vite app.
