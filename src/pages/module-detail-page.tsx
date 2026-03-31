import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE_MAP } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';
import { ModuleFormSection, ModuleHeader, PatientSelector, SaveResultDialog } from '@/components/rt/reusable';
import { Button } from '@/components/ui/button';
import { MobileActionBar, MobileHistoryAccordion, MobileResultCard } from '@/components/mobile/mobile-ui';
import { ModuleFeatureStatus } from '@/types/ai-modules';

const STATUS_OPTIONS: ModuleFeatureStatus[] = ['planned', 'active', 'review', 'retired'];

export function ModuleDetailPage() {
  const { moduleKey = '' } = useParams();
  const moduleDef = MODULE_MAP[moduleKey];
  const { patients, runModule, executions, moduleFeatures, addModuleFeature, updateModuleFeature, removeModuleFeature, resetModuleFeatures } = useRTStore();
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [newFeature, setNewFeature] = useState('');

  const history = useMemo(() => executions.filter((x) => x.moduleKey === moduleKey), [executions, moduleKey]);
  const featureRows = useMemo(() => moduleFeatures.filter((f) => f.moduleKey === moduleKey), [moduleFeatures, moduleKey]);
  const statusSummary = useMemo(() => STATUS_OPTIONS.reduce<Record<ModuleFeatureStatus, number>>((acc, key) => {
    acc[key] = featureRows.filter((f) => f.status === key).length;
    return acc;
  }, { planned: 0, active: 0, review: 0, retired: 0 }), [featureRows]);

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
    <ModuleFormSection title="Sistem Fitur Modul (CRUD)">
      <p className="mb-3 text-sm text-muted-foreground">Bukan hanya daftar tulisan: setiap fitur bisa ditambah, diubah statusnya, diberi catatan operasional, atau dihapus.</p>
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
        {STATUS_OPTIONS.map((status) => <div key={status} className="rounded border p-2">
          <p className="font-medium capitalize">{status}</p>
          <p className="text-muted-foreground">{statusSummary[status]} fitur</p>
        </div>)}
      </div>

      <div className="mb-3 flex flex-col gap-2 md:flex-row">
        <input className="h-11 flex-1 rounded border p-2" placeholder="Tambah fitur custom / alur kerja lokal" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} />
        <Button onClick={() => { addModuleFeature(moduleKey, newFeature); setNewFeature(''); }}>Tambah Fitur</Button>
        <Button variant="outline" onClick={() => resetModuleFeatures(moduleKey)}>Reset Default</Button>
      </div>

      <div className="space-y-2">
        {featureRows.map((feature) => <div key={feature.id} className="rounded border p-3">
          <div className="mb-2 flex flex-col gap-2 md:flex-row">
            <input className="h-10 flex-1 rounded border px-2 text-sm" value={feature.name} onChange={(e) => updateModuleFeature(feature.id, { name: e.target.value })} />
            <select className="h-10 rounded border px-2 text-sm capitalize" value={feature.status} onChange={(e) => updateModuleFeature(feature.id, { status: e.target.value as ModuleFeatureStatus })}>
              {STATUS_OPTIONS.map((option) => <option key={option} value={option} className="capitalize">{option}</option>)}
            </select>
            {feature.source === 'custom' && <Button variant="outline" onClick={() => removeModuleFeature(feature.id)}>Hapus</Button>}
          </div>
          <textarea className="min-h-20 w-full rounded border p-2 text-sm" placeholder="Catatan implementasi/owner/deadline" value={feature.note ?? ''} onChange={(e) => updateModuleFeature(feature.id, { note: e.target.value })} />
          <p className="mt-1 text-xs text-muted-foreground">Sumber: {feature.source} • Update: {new Date(feature.updatedAt).toLocaleString()}</p>
        </div>)}
      </div>
    </ModuleFormSection>
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
