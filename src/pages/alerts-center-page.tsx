import { useMemo, useState } from 'react';
import { useRTStore } from '@/lib/rt-store';
import { MobileAlertList } from '@/components/mobile/mobile-ui';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function AlertsCenterPage() {
  const { notifications } = useRTStore();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('all');

  const severityCount = useMemo(() => notifications.reduce<Record<string, number>>((acc, item) => {
    acc[item.severity] = (acc[item.severity] ?? 0) + 1;
    return acc;
  }, {}), [notifications]);

  const filtered = notifications
    .filter((item) => severity === 'all' || item.severity === severity)
    .filter((item) => `${item.patientId} ${item.moduleKey} ${item.message}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 p-3 md:p-6">
      <h1 className="hidden text-2xl font-bold md:block">Alerts Center</h1>

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Alerts</p><p className="text-2xl font-bold">{notifications.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Critical</p><p className="text-2xl font-bold">{severityCount.critical ?? 0}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">High</p><p className="text-2xl font-bold">{severityCount.high ?? 0}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Moderate/Low</p><p className="text-2xl font-bold">{(severityCount.moderate ?? 0) + (severityCount.low ?? 0)}</p></Card>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_220px]">
        <Input placeholder="Cari alert (patient/module/message)" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11" />
        <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="h-11">
          <option value="all">Semua Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-4 text-sm text-muted-foreground">Tidak ada alert untuk filter saat ini.</Card>
      ) : (
        <MobileAlertList items={filtered.map((n) => ({ id: n.id, title: `${n.patientId} • ${n.moduleKey}`, detail: n.message, severity: n.severity }))} />
      )}
    </div>
  );
}
