import { useRTStore } from '@/lib/rt-store';

export function ReportsPage() {
  const { executions } = useRTStore();
  const grouped = executions.reduce<Record<string, number>>((acc, item) => {
    acc[item.moduleKey] = (acc[item.moduleKey] ?? 0) + 1;
    return acc;
  }, {});
  return <div className="p-6 space-y-3"><h1 className="text-2xl font-bold">Reports</h1>{Object.entries(grouped).map(([k, v]) => <div className="rounded border p-2" key={k}>{k}: {v} analisis</div>)}</div>;
}
