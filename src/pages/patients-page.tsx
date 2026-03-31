import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useRTStore } from '@/lib/rt-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function PatientsPage() {
  const { patients, notifications, getPatientExecutions } = useRTStore();
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const stats = {
    total: patients.length,
    withAlerts: patients.filter((patient) => notifications.some((item) => item.patientId === patient.id)).length,
    noAlerts: patients.filter((patient) => !notifications.some((item) => item.patientId === patient.id)).length,
  };

  const rows = useMemo(() => patients
    .map((patient) => {
      const patientAlerts = notifications.filter((item) => item.patientId === patient.id);
      const criticalCount = patientAlerts.filter((item) => item.severity === 'critical').length;
      const runCount = getPatientExecutions(patient.id).length;
      const riskLevel = criticalCount > 0 ? 'critical' : patientAlerts.length > 0 ? 'high' : 'stable';
      return { patient, patientAlerts, criticalCount, runCount, riskLevel };
    })
    .filter(({ patient, riskLevel }) => {
      const matchesQuery = `${patient.id} ${patient.name} ${patient.diagnosis}`.toLowerCase().includes(query.toLowerCase());
      const matchesRisk = riskFilter === 'all' || riskFilter === riskLevel;
      return matchesQuery && matchesRisk;
    })
    .sort((a, b) => b.patientAlerts.length - a.patientAlerts.length), [patients, notifications, getPatientExecutions, query, riskFilter]);

  return (
    <div className="space-y-4 p-3 md:p-6">
      <h1 className="hidden text-2xl font-bold md:block">Patients</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-3"><p className="text-xs text-muted-foreground">Total Pasien</p><p className="text-2xl font-bold">{stats.total}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Perlu Review</p><p className="text-2xl font-bold">{stats.withAlerts}</p></Card>
        <Card className="p-3"><p className="text-xs text-muted-foreground">Stabil</p><p className="text-2xl font-bold">{stats.noAlerts}</p></Card>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_220px]">
        <Input placeholder="Cari pasien (nama/ID/diagnosis)" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11" />
        <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="h-11">
          <option value="all">Semua Risiko</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="stable">Stable</option>
        </Select>
      </div>

      <div className="space-y-2">
        {rows.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground">Tidak ada pasien yang cocok dengan filter saat ini.</Card>
        ) : rows.map(({ patient, patientAlerts, criticalCount, runCount, riskLevel }) => (
          <Link key={patient.id} to={`/patients/${patient.id}`}>
            <Card className="space-y-2 p-3 transition hover:bg-muted/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{patient.id} — {patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.diagnosis} • {patient.age} tahun</p>
                </div>
                <Badge className={riskLevel === 'critical' ? 'bg-red-100 text-red-700' : riskLevel === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}>
                  {riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge className="bg-muted text-foreground">{runCount} modul</Badge>
                <Badge className="bg-muted text-foreground">{patientAlerts.length} alerts</Badge>
                {criticalCount > 0 && <Badge className="bg-red-100 text-red-700">{criticalCount} critical</Badge>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
