import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { radiotherapyData } from '@/data/radiotherapy-dummy';

export function RTPatientsPage() {
  return (
    <AppShell title="Patients">
      <Card>
        <h3 className="mb-3 text-lg font-semibold">Integrated Patient Registry</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-2 py-2">MRN</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Diagnosis</th>
                <th className="px-2 py-2">Regimen</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {radiotherapyData.patients.map((patient) => (
                <tr key={patient.id} className="border-b border-border/60">
                  <td className="px-2 py-2">{patient.mrn}</td>
                  <td className="px-2 py-2">{patient.name}</td>
                  <td className="px-2 py-2">{patient.diagnosis.cancerSite} ({patient.diagnosis.stage})</td>
                  <td className="px-2 py-2">{patient.regimen}</td>
                  <td className="px-2 py-2">{patient.therapyStatus}</td>
                  <td className="px-2 py-2"><Link className="text-primary underline" to={`/patients/${patient.id}`}>Open profile</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
