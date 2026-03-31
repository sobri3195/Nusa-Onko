import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { AlertTriangle, Blocks, Clock3, ShieldAlert, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRTStore } from '@/lib/rt-store';
import { MODULE_MAP } from '@/services/module-definitions';

function StatCard({ title, value, detail, icon: Icon }: { title: string; value: string | number; detail: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="space-y-1 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </Card>
  );
}

export function DashboardPage() {
  const { patients, notifications, executions } = useRTStore();

  const criticalAlerts = notifications.filter((n) => n.severity === 'critical').length;
  const highAlerts = notifications.filter((n) => n.severity === 'high').length;

  const moduleRuns = useMemo(() => executions.reduce<Record<string, number>>((acc, item) => {
    acc[item.moduleKey] = (acc[item.moduleKey] ?? 0) + 1;
    return acc;
  }, {}), [executions]);

  const topModules = Object.entries(moduleRuns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const patientRiskSummary = patients
    .map((patient) => {
      const patientAlerts = notifications.filter((n) => n.patientId === patient.id);
      const riskScore = patientAlerts.reduce((score, item) => score + (item.severity === 'critical' ? 3 : item.severity === 'high' ? 2 : 1), 0);
      return { patient, riskScore, alertCount: patientAlerts.length };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const lastExecution = executions[0];

  return (
    <div className="space-y-4 p-3 md:p-6">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-white/90">Ringkasan operasional AI radioterapi harian: pasien, modul, alert, dan aktivitas terbaru.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/patients"><Button variant="outline" className="h-8 border-white/60 bg-white text-indigo-700 hover:bg-white">Lihat Pasien</Button></Link>
          <Link to="/modules"><Button variant="outline" className="h-8 border-white/60 bg-white text-indigo-700 hover:bg-white">Jalankan Modul</Button></Link>
          <Link to="/alerts"><Button variant="outline" className="h-8 border-white/60 bg-white text-indigo-700 hover:bg-white">Tinjau Alert</Button></Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Patients" value={patients.length} detail="Pasien terdaftar di sistem" icon={Users} />
        <StatCard title="Total Module Runs" value={executions.length} detail="Eksekusi modul AI kumulatif" icon={Blocks} />
        <StatCard title="Critical Alerts" value={criticalAlerts} detail={`${highAlerts} alert high lainnya`} icon={ShieldAlert} />
        <StatCard title="Pending Review" value={notifications.length} detail="Alert menunggu tindakan klinis" icon={AlertTriangle} />
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Top Modules</h2>
            <Badge>{topModules.length} modul aktif</Badge>
          </div>
          {topModules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada eksekusi modul. Mulai dari halaman Modules.</p>
          ) : (
            <div className="space-y-2">
              {topModules.map(([key, count]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <p>{MODULE_MAP[key]?.name ?? key}</p>
                  <Badge className="bg-muted text-foreground">{count} run</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-4">
          <h2 className="font-semibold">Prioritas Pasien</h2>
          <div className="space-y-2">
            {patientRiskSummary.map((item) => (
              <Link key={item.patient.id} to={`/patients/${item.patient.id}`} className="flex items-center justify-between rounded-lg border p-2 text-sm hover:bg-muted/60">
                <div>
                  <p className="font-medium">{item.patient.name}</p>
                  <p className="text-xs text-muted-foreground">{item.patient.diagnosis}</p>
                </div>
                <Badge className={item.riskScore > 3 ? 'bg-red-100 text-red-700' : ''}>{item.alertCount} alerts</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <Card className="space-y-2 p-4">
        <h2 className="font-semibold">Aktivitas Terbaru</h2>
        {lastExecution ? (
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">{MODULE_MAP[lastExecution.moduleKey]?.name ?? lastExecution.moduleKey}</p>
            <p className="text-sm text-muted-foreground">Patient ID: {lastExecution.patientId}</p>
            <p className="mt-1 text-sm">{lastExecution.result.summary}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{new Date(lastExecution.result.generatedAt).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada aktivitas. Jalankan analisis pertama dari halaman module.</p>
        )}
      </Card>
    </div>
  );
}
