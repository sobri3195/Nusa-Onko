import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiModules, radiotherapyData } from '@/data/radiotherapy-dummy';
import { SeverityBadge } from '@/components/radiotherapy-ui';

export function RTPatientDetailPage() {
  const { id } = useParams();
  const patient = radiotherapyData.patients.find((p) => p.id === id);

  const patientBundle = useMemo(() => {
    if (!patient) return null;
    return {
      aiResults: radiotherapyData.aiResults.filter((r) => r.patientId === patient.id),
      imaging: radiotherapyData.imagingStudies.filter((i) => i.patientId === patient.id),
      plans: radiotherapyData.treatmentPlans.filter((p) => p.patientId === patient.id),
      toxicity: radiotherapyData.toxicityAssessments.filter((t) => t.patientId === patient.id),
      docs: radiotherapyData.documentAudits.filter((d) => d.patientId === patient.id)
    };
  }, [patient]);

  if (!patient || !patientBundle) {
    return (
      <AppShell title="Patient Detail">
        <Card>
          <p>Patient not found.</p>
          <Link className="text-primary underline" to="/patients">Back to patients</Link>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={`Patient 360° • ${patient.name}`}>
      <Card className="grid gap-2 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">MRN</p>
          <p className="font-semibold">{patient.mrn}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Diagnosis</p>
          <p className="font-semibold">{patient.diagnosis.cancerSite} / {patient.diagnosis.stage}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Regimen</p>
          <p className="font-semibold">{patient.regimen}</p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Integrated AI Results</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {aiModules.map((moduleName) => {
            const result = patientBundle.aiResults.find((item) => item.moduleName === moduleName);
            return (
              <div key={moduleName} className="rounded-lg border border-border p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-medium">{moduleName}</p>
                  {result ? <SeverityBadge severity={result.severity} /> : <span className="text-xs text-muted-foreground">No run</span>}
                </div>
                <p className="text-sm text-muted-foreground">{result?.summary ?? 'Belum ada hasil model untuk pasien ini.'}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confidence: {result ? `${Math.round(result.confidence * 100)}%` : '-'}</span>
                  <Button className="h-7 px-2 text-xs" variant="outline">Simpan ke Dashboard</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Imaging Timeline</h3>
          {patientBundle.imaging.map((image) => (
            <p key={image.id} className="text-sm">{image.date} • {image.type} • <span className="text-muted-foreground">{image.metadata}</span></p>
          ))}
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Document Audit & Toxicity</h3>
          {patientBundle.docs.map((doc) => (
            <p key={doc.id} className="mb-2 text-sm">{doc.date} • {doc.status} • {doc.issues.join(', ')}</p>
          ))}
          {patientBundle.toxicity.map((tox) => (
            <p key={tox.id} className="text-sm">{tox.date} • {tox.toxicityType} grade {tox.grade}</p>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
