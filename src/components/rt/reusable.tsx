import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnalysisResult, Severity } from '@/types/ai-modules';

export function PatientSelector({ value, onChange, patients }: { value: string; onChange: (v: string) => void; patients: { id: string; name: string }[] }) {
  return <select className="w-full rounded border p-2" value={value} onChange={(e) => onChange(e.target.value)}><option value="">Pilih pasien</option>{patients.map((p) => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}</select>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, string> = { low: 'bg-emerald-100 text-emerald-700', moderate: 'bg-amber-100 text-amber-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };
  return <Badge className={map[severity]}>{severity.toUpperCase()}</Badge>;
}

export function RiskScoreCard({ score, label }: { score: number; label: string }) {
  return <Card><p className="text-sm font-semibold">{label}</p><p className="text-3xl font-bold">{score.toFixed(1)}</p></Card>;
}

export function ModuleHeader({ title, purpose }: { title: string; purpose: string }) { return <div className="space-y-1"><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-muted-foreground">{purpose}</p></div>; }

export function AnalysisResultPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) return <Card>Belum ada hasil analisis.</Card>;
  return <Card><div className="space-y-2"><p className="font-semibold">Result</p><div className="flex items-center gap-2"><RiskScoreCard score={result.score} label="Risk Score" /><SeverityBadge severity={result.severity} /></div><p>{result.summary}</p><p className="text-sm">Rekomendasi: {result.recommendation}</p><p className="text-xs text-muted-foreground">{new Date(result.generatedAt).toLocaleString()}</p></div></Card>;
}

export function HistoryTable({ rows }: { rows: { id: string; patientId: string; score: number; severity: Severity; generatedAt: string }[] }) {
  return <Card><p className="mb-2 font-semibold">History</p><div className="space-y-2 text-sm">{rows.map((row) => <div key={row.id} className="flex justify-between rounded border p-2"><span>{row.patientId}</span><span>{row.score.toFixed(1)}</span><SeverityBadge severity={row.severity} /><span>{new Date(row.generatedAt).toLocaleDateString()}</span></div>)}</div></Card>;
}

export function AlertBanner({ text }: { text: string }) { return <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">⚠ {text}</div>; }
export function SaveResultDialog() { return <Button variant="outline">Save to Patient</Button>; }
export function ModuleFormSection({ title, children }: { title: string; children: React.ReactNode }) { return <Card><p className="mb-3 font-semibold">{title}</p><div className="space-y-3">{children}</div></Card>; }
