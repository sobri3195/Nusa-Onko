import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRTStore } from '@/lib/rt-store';
import { SeverityBadge } from '@/components/rt/reusable';

export function PatientDetailPage() {
  const { id = '' } = useParams();
  const { patients, getPatientExecutions, notifications } = useRTStore();
  const patient = patients.find((p) => p.id === id);
  const execs = useMemo(() => getPatientExecutions(id), [getPatientExecutions, id]);
  if (!patient) return <div className="p-6">Patient not found</div>;
  return <div className="p-6 space-y-4"><h1 className="text-2xl font-bold">{patient.name}</h1>
    <div className="rounded border p-3">Overview: {patient.diagnosis} | Age {patient.age}</div>
    <div className="rounded border p-3">Treatment summary: mock VMAT 70Gy/35fx</div>
    <div className="space-y-2"><h2 className="font-semibold">Semua hasil modul</h2>{execs.map((e) => <div key={e.id} className="rounded border p-2 text-sm flex justify-between"><span>{e.moduleKey}</span><span>{e.result.score.toFixed(1)}</span><SeverityBadge severity={e.result.severity} /></div>)}</div>
    <div className="space-y-2"><h2 className="font-semibold">Alerts</h2>{notifications.filter((n) => n.patientId === id).map((n) => <div key={n.id} className="rounded border border-red-300 bg-red-50 p-2 text-sm">{n.message}</div>)}</div>
    <div className="rounded border p-3 text-sm">Timeline aktivitas: simulation → planning → analysis modules → follow-up</div>
  </div>;
}
