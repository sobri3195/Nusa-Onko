import { useRTStore } from '@/lib/rt-store';
import { SeverityBadge } from '@/components/rt/reusable';

export function AlertsCenterPage() {
  const { notifications } = useRTStore();
  return <div className="p-6 space-y-3"><h1 className="text-2xl font-bold">Alerts Center</h1>{notifications.map((n) => <div key={n.id} className="rounded border p-2 flex justify-between"><span>{n.patientId} - {n.message}</span><SeverityBadge severity={n.severity} /></div>)}</div>;
}
