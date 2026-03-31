import { useRTStore } from '@/lib/rt-store';
import { MobileAlertList } from '@/components/mobile/mobile-ui';

export function AlertsCenterPage() {
  const { notifications } = useRTStore();

  return (
    <div className="space-y-3 p-3 md:p-6">
      <h1 className="hidden text-2xl font-bold md:block">Alerts Center</h1>
      <MobileAlertList items={notifications.map((n) => ({ id: n.id, title: `${n.patientId} • ${n.moduleKey}`, detail: n.message, severity: n.severity }))} />
    </div>
  );
}
