import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRTStore } from '@/lib/rt-store';
import { MODULE_MAP } from '@/services/module-definitions';
import { Button } from '@/components/ui/button';

const downloadTextFile = (filename: string, content: string, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

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
  const reportDate = new Date().toISOString().slice(0, 10);

  const exportJson = () => {
    downloadTextFile(`nusa-onko-report-${reportDate}.json`, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalExecutions: executions.length,
      totalAlerts: notifications.length,
      moduleUsage,
      severityDistribution,
    }, null, 2), 'application/json;charset=utf-8');
  };

  const exportCsv = () => {
    const rows = [
      ['module_key', 'module_name', 'run_count'],
      ...moduleUsage.map(([moduleKey, count]) => [moduleKey, MODULE_MAP[moduleKey]?.name ?? moduleKey, String(count)]),
    ];
    const content = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    downloadTextFile(`nusa-onko-module-usage-${reportDate}.csv`, content, 'text/csv;charset=utf-8');
  };

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Laporan Penggunaan Modul</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv} disabled={moduleUsage.length === 0}>Export CSV</Button>
            <Button variant="outline" onClick={exportJson}>Export JSON</Button>
          </div>
        </div>
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
