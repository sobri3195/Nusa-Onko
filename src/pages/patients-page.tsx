import { Link } from 'react-router-dom';
import { useRTStore } from '@/lib/rt-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function PatientsPage() {
  const { patients, notifications } = useRTStore();
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-3 p-3 md:p-6">
      <h1 className="hidden text-2xl font-bold md:block">Patients List</h1>
      <Input placeholder="Cari pasien (nama/ID)" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11" />
      <div className="space-y-2">
        {patients
          .filter((p) => `${p.id} ${p.name}`.toLowerCase().includes(query.toLowerCase()))
          .map((p) => {
            const alertCount = notifications.filter((n) => n.patientId === p.id).length;
            return (
              <Link key={p.id} to={`/patients/${p.id}`}>
                <Card className="space-y-1 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{p.id} — {p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.diagnosis}</p>
                    </div>
                    {alertCount > 0 && <Badge className="bg-red-100 text-red-700">{alertCount} Alerts</Badge>}
                  </div>
                </Card>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
