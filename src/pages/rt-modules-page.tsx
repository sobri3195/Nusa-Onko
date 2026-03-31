import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';
import { aiModules, radiotherapyData } from '@/data/radiotherapy-dummy';
import { SeverityBadge } from '@/components/radiotherapy-ui';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function RTModulePage() {
  const { moduleKey = 'autocontour-one' } = useParams();
  const selectedName = aiModules.find((m) => slugify(m) === moduleKey) ?? aiModules[0];
  const results = radiotherapyData.aiResults.filter((r) => slugify(r.moduleName) === moduleKey);

  return (
    <AppShell title={`AI Modules • ${selectedName}`}>
      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          {aiModules.map((moduleName) => (
            <Link key={moduleName} to={`/modules/${slugify(moduleName)}`} className={`rounded-md border px-3 py-1 text-xs ${selectedName === moduleName ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              {moduleName}
            </Link>
          ))}
        </div>
        <p className="mb-3 text-sm text-muted-foreground">Input data, output prediksi, confidence, risk interpretation, riwayat hasil, dan simpan ke profil pasien berada dalam satu halaman modul.</p>
        <div className="space-y-2">
          {results.map((result) => (
            <div key={result.id} className="rounded-lg border border-border p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium">Patient: {radiotherapyData.patients.find((p) => p.id === result.patientId)?.name}</p>
                <SeverityBadge severity={result.severity} />
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
              <p className="mt-1 text-xs text-muted-foreground">Confidence {Math.round(result.confidence * 100)}% • Risk {Math.round(result.riskScore * 100)}%</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
