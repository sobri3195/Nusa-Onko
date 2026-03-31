import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE_MAP } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';
import { AnalysisResultPanel, HistoryTable, ModuleFormSection, ModuleHeader, PatientSelector, SaveResultDialog } from '@/components/rt/reusable';
import { Button } from '@/components/ui/button';

export function ModuleDetailPage() {
  const { moduleKey = '' } = useParams();
  const moduleDef = MODULE_MAP[moduleKey];
  const { patients, runModule, executions } = useRTStore();
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const history = useMemo(() => executions.filter((x) => x.moduleKey === moduleKey), [executions, moduleKey]);

  if (!moduleDef) return <div className="p-6">Module tidak ditemukan.</div>;

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    moduleDef.fields.forEach((field) => {
      if (field.required && !form[field.name]) nextErrors[field.name] = `${field.label} wajib diisi`;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const payload: Record<string, unknown> = { ...form };
    setResult(runModule(moduleKey, payload));
  };

  return <div className="space-y-4 p-6">
    <ModuleHeader title={moduleDef.name} purpose={moduleDef.purpose} />
    <ModuleFormSection title="Input Form">
      {moduleDef.fields.map((field) => <div key={field.name} className="space-y-1">
        <label className="text-sm font-medium">{field.label}</label>
        {field.name === 'patientId' ? <PatientSelector value={form[field.name] ?? ''} onChange={(v) => setForm((p) => ({ ...p, [field.name]: v }))} patients={patients} /> : field.type === 'textarea' ? <textarea className="w-full rounded border p-2" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))} /> : field.type === 'select' ? <select className="w-full rounded border p-2" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}><option value="">Pilih</option>{field.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select> : <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} className="w-full rounded border p-2" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))} />}
        {errors[field.name] && <p className="text-xs text-red-600">{errors[field.name]}</p>}
      </div>)}
      <div className="flex gap-2"><Button onClick={submit}>Run Analysis</Button><Button variant="outline" onClick={() => { setForm({}); setErrors({}); }}>Reset</Button><SaveResultDialog /></div>
    </ModuleFormSection>
    <AnalysisResultPanel result={result} />
    <HistoryTable rows={history.map((h) => ({ id: h.id, patientId: h.patientId, score: h.result.score, severity: h.result.severity, generatedAt: h.result.generatedAt }))} />
  </div>;
}
