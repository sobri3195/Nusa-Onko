import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { radiotherapyData } from '@/data/radiotherapy-dummy';
import { SeverityBadge } from '@/components/radiotherapy-ui';

export function RTAlertsPage() {
  return (
    <AppShell title="Alerts & Notifications">
      <Card>
        <div className="space-y-2">
          {radiotherapyData.notifications.map((n) => (
            <div key={n.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.category} • {new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <SeverityBadge severity={n.severity} />
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
