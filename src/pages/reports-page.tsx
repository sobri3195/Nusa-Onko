import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRTStore } from '@/lib/rt-store';
import { MODULE_MAP } from '@/services/module-definitions';

export function ReportsPage() {
  const { executions, notifications, patients } = useRTStore();

  const moduleUsage = useMemo(() => Object.entries(executions.reduce<Record<string, number>>((acc, item) => {
    acc[item.moduleKey] = (acc[item.moduleKey] ?? 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]), [executions]);

  const severityDistribution = notifications.reduce<Record<string, number>>((acc, item) => {
    acc[item.severity] = (acc[item.severity] ?? 0) + 1;
    return acc;
  }, {});

  const topPatient = patients
    .map((patient) => ({
      ...patient,
      executionCount: executions.filter((item) => item.patientId === patient.id).length,
      alertCount: notifications.filter((item) => item.patientId === patient.id).length,
    }))
    .sort((a, b) => b.executionCount - a.executionCount)[0];

  const lastRun = executions[0];

  return (
    <div className="space-y-4 p-3 md:p-6">
      <h1 className="hidden text-2xl font-bold md:block">Profile / Reports</h1>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Eksekusi</p><p className="text-2xl font-bold">{executions.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Modules Digunakan</p><p className="text-2xl font-bold">{moduleUsage.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Alerts</p><p className="text-2xl font-bold">{notifications.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Patient Coverage</p><p className="text-2xl font-bold">{patients.length}</p></Card>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <Card className="space-y-3 p-4">
          <h2 className="font-semibold">Profile Ringkas</h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Role:</span> Admin Radioterapi</p>
            <p><span className="font-medium">Unit:</span> Onkologi Radiasi</p>
            <p><span className="font-medium">Last Run:</span> {lastRun ? new Date(lastRun.result.generatedAt).toLocaleString() : 'Belum ada run'}</p>
          </div>
          {topPatient && (
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">Most Active Patient: {topPatient.name}</p>
              <p className="text-muted-foreground">{topPatient.executionCount} eksekusi • {topPatient.alertCount} alerts</p>
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-4">
          <h2 className="font-semibold">Distribusi Severity Alert</h2>
          <div className="flex flex-wrap gap-2">
            {(['critical', 'high', 'moderate', 'low'] as const).map((item) => (
              <Badge key={item} className="bg-muted text-foreground">{item}: {severityDistribution[item] ?? 0}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Gunakan distribusi ini untuk menentukan prioritas review dan kapasitas tim.</p>
        </Card>
      </section>

      <Card className="space-y-3 p-4">
        <h2 className="font-semibold">Laporan Penggunaan Modul</h2>
        {moduleUsage.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data laporan. Jalankan modul terlebih dahulu.</p>
        ) : (
          <div className="space-y-2">
            {moduleUsage.map(([key, count]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                <p>{MODULE_MAP[key]?.name ?? key}</p>
                <Badge>{count} kali</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
