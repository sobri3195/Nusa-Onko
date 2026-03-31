import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { radiotherapyData } from '@/data/radiotherapy-dummy';

export function RTSettingsPage() {
  return (
    <AppShell title="Settings & Access Control">
      <Card>
        <h3 className="mb-2 font-semibold">Role-based Access Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {radiotherapyData.roles.map((role) => (
                <tr key={role.id} className="border-b border-border/60">
                  <td className="px-2 py-2">{role.name}</td>
                  <td className="px-2 py-2">{role.permissions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
