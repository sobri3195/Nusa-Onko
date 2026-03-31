import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { storage } from '@/lib/storage';

export function SettingsPage({ onReset, onRestore }: { onReset: () => void; onRestore: () => void }) {
  const [dark, setDark] = useState(storage.getTheme() === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    storage.setTheme(dark ? 'dark' : 'light');
  }, [dark]);

  return <div className="space-y-4">
    <h1 className="text-xl font-bold">Settings / About</h1>
    <Card className="space-y-2"><p className="text-sm">Nusa Onko adalah frontend prototype manajemen ide AI radioterapi. Data tersimpan lokal di browser (localStorage).</p></Card>
    <Card className="space-y-3"><label className="flex items-center gap-2"><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark mode</label><Button onClick={onReset} variant="destructive">Reset Local Storage</Button><Button onClick={onRestore} variant="outline">Restore Seed Data</Button></Card>
  </div>;
}
