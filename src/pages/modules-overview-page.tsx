import { Link } from 'react-router-dom';
import { MODULE_DEFINITIONS } from '@/services/module-definitions';
import { useRTStore } from '@/lib/rt-store';

export function ModulesOverviewPage() {
  const { executions, notifications } = useRTStore();
  return <div className="p-6 space-y-4"><h1 className="text-2xl font-bold">Modules Overview</h1>
    {MODULE_DEFINITIONS.map((m) => {
      const count = executions.filter((x) => x.moduleKey === m.key).length;
      const alertCount = notifications.filter((x) => x.moduleKey === m.key).length;
      return <Link key={m.key} to={`/modules/${m.key}`} className="block rounded border p-4 hover:bg-muted"><div className="font-semibold">{m.name}</div><div className="text-sm text-muted-foreground">{m.purpose}</div><div className="text-xs">Analisis: {count} | Alerts: {alertCount}</div></Link>;
    })}
  </div>;
}
