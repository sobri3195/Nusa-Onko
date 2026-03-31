import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE_MAP } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';
import { ModuleFormSection, ModuleHeader, PatientSelector, SaveResultDialog } from '@/components/rt/reusable';
import { Button } from '@/components/ui/button';
import { MobileActionBar, MobileHistoryAccordion, MobileResultCard } from '@/components/mobile/mobile-ui';

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

  return <div className="space-y-4 p-3 md:p-6">
    <ModuleHeader title={moduleDef.name} purpose={moduleDef.purpose} />
    <ModuleFormSection title="Input Form (mobile single-column)">
      {moduleDef.fields.map((field) => <div key={field.name} className="space-y-1">
        <label className="text-sm font-medium">{field.label}</label>
        {field.name === 'patientId' ? <PatientSelector value={form[field.name] ?? ''} onChange={(v) => setForm((p) => ({ ...p, [field.name]: v }))} patients={patients} /> : field.type === 'textarea' ? <textarea className="min-h-24 w-full rounded border p-3" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))} /> : field.type === 'select' ? <select className="h-11 w-full rounded border p-2" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))}><option value="">Pilih</option>{field.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select> : <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} className="h-11 w-full rounded border p-2" value={form[field.name] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [field.name]: e.target.value }))} />}
        {errors[field.name] && <p className="text-xs text-red-600">{errors[field.name]}</p>}
      </div>)}

      <MobileActionBar>
        <Button className="flex-1" onClick={submit}>Run Analysis</Button>
        <Button className="flex-1" variant="outline" onClick={() => { setForm({}); setErrors({}); }}>Reset</Button>
        <SaveResultDialog />
      </MobileActionBar>
    </ModuleFormSection>

    {result && <MobileResultCard score={result.score} severity={result.severity} summary={result.summary} recommendation={result.recommendation} />}

    <MobileActionBar>
      <Button className="flex-1" variant="outline">Save to Patient</Button>
      <Button className="flex-1" variant="outline" onClick={submit}>Re-run Analysis</Button>
      <Button className="flex-1" variant="outline">View History</Button>
    </MobileActionBar>

    <ModuleFormSection title="History (mobile accordion)">
      <MobileHistoryAccordion items={history.map((h) => ({ id: h.id, title: `${h.patientId} — ${h.result.score.toFixed(1)} (${h.result.severity})`, detail: h.result.summary, meta: new Date(h.result.generatedAt).toLocaleString() }))} />
    </ModuleFormSection>
  </div>;
}
