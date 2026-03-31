import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function SettingsPage({ onReset, onRestore, onRefresh }: { onReset: () => void; onRestore: () => void; onRefresh: () => void }) {
  const [dark, setDark] = useState(storage.getTheme() === 'dark');
  const [rawJson, setRawJson] = useState('');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    storage.setTheme(dark ? 'dark' : 'light');
  }, [dark]);

  const exportData = () => {
    const data = storage.exportProjects();
    navigator.clipboard.writeText(data)
      .then(() => toast.success('Data project disalin ke clipboard'))
      .catch(() => toast.error('Gagal menyalin. Silakan copy manual dari textarea.'));
    setRawJson(data);
  };
  const importData = () => {
    try {
      storage.importProjects(rawJson);
      onRefresh();
      toast.success('Import project berhasil');
    } catch {
      toast.error('Import gagal. Pastikan format JSON valid.');
    }
  };

  return <div className="space-y-4">
    <h1 className="text-xl font-bold">Settings / About</h1>
    <Card className="space-y-2 animate-in"><p className="text-sm">Nusa Onko adalah frontend prototype manajemen ide AI radioterapi. Data tersimpan lokal di browser (localStorage).</p></Card>
    <Card className="space-y-3 animate-in"><label className="flex items-center gap-2"><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark mode</label><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><Button onClick={onReset} variant="destructive">Reset Local Storage</Button><Button onClick={onRestore} variant="outline">Restore Seed Data</Button></div></Card>
    <Card className="space-y-3 animate-in">
      <p className="text-sm font-medium">Backup / Restore Data</p>
      <Button onClick={exportData} variant="outline">Copy Export JSON</Button>
      <Textarea placeholder="Paste JSON project di sini untuk import..." value={rawJson} onChange={(e) => setRawJson(e.target.value)} />
      <Button onClick={importData}>Import JSON</Button>
    </Card>
  </div>;
}
