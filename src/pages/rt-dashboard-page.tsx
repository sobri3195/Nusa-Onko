import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { radiotherapyData } from '@/data/radiotherapy-dummy';
import { SeverityBadge, StatCard } from '@/components/radiotherapy-ui';

export function RTDashboardPage() {
  const activePatients = radiotherapyData.patients.filter((p) => p.therapyStatus !== 'Follow-up').length;
  const criticalAlerts = radiotherapyData.notifications.filter((n) => n.severity === 'Critical').length;
  const adaptiveAlerts = radiotherapyData.notifications.filter((n) => n.category === 'Dose-Drift Detector').length;
  const setupAlerts = radiotherapyData.aiResults.filter((r) => r.moduleName === 'Setup-Error Zero' && (r.severity === 'High' || r.severity === 'Critical')).length;

  return (
    <AppShell title="Unified Dashboard">
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard title="Active Patients" value={activePatients} detail="Across simulation, planning, and treatment" />
        <StatCard title="Adaptive Replan Alerts" value={adaptiveAlerts} detail="Dose-Drift Detector" />
        <StatCard title="Setup Error Alerts" value={setupAlerts} detail="Real-time portal/CBCT shift recommendations" />
        <StatCard title="Critical Document/Waitlist" value={criticalAlerts} detail="Needs multidisciplinary review" />
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Recent AI Module Activity</h3>
        <div className="space-y-2">
          {radiotherapyData.aiResults.slice(0, 8).map((result) => (
            <div key={result.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">{result.moduleName}</p>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence {Math.round(result.confidence * 100)}%</span>
                <SeverityBadge severity={result.severity} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Department Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Patient</th>
                <th className="px-2 py-2">Message</th>
                <th className="px-2 py-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {radiotherapyData.notifications.map((n) => {
                const patient = radiotherapyData.patients.find((p) => p.id === n.patientId);
                return (
                  <tr key={n.id} className="border-b border-border/60">
                    <td className="px-2 py-2">{n.category}</td>
                    <td className="px-2 py-2">{patient?.name}</td>
                    <td className="px-2 py-2">{n.message}</td>
                    <td className="px-2 py-2"><SeverityBadge severity={n.severity} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
