import { Link } from 'react-router-dom';
import { useRTStore } from '@/lib/rt-store';

export function PatientsPage() {
  const { patients } = useRTStore();
  return <div className="p-6 space-y-4"><h1 className="text-2xl font-bold">Patients List</h1>{patients.map((p) => <Link key={p.id} to={`/patients/${p.id}`} className="block rounded border p-3"><div>{p.id} - {p.name}</div><div className="text-sm text-muted-foreground">{p.diagnosis}</div></Link>)}</div>;
}
