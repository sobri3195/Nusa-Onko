import { AppShell } from '@/components/layout/app-shell';
import { Card } from '@/components/ui/card';

const flow = [
  'Registrasi pasien',
  'Simulasi / imaging',
  'AutoContour-One contouring',
  'PlanPilot-VMAT planning',
  'Setup-Error Zero + Dose-Drift monitoring',
  'Toxicity follow-up (Mucositis/Pneumo/RILD/Cognition)',
  'Outcome prediction',
  'RT-DocWatch document audit',
  'WaitList-Fair reprioritization'
];

export function RTWorkflowPage() {
  return (
    <AppShell title="Clinical Workflow Integration">
      <Card>
        <h3 className="mb-4 text-lg font-semibold">End-to-end Workflow</h3>
        <ol className="space-y-2 text-sm">
          {flow.map((step, idx) => (
            <li key={step} className="rounded-lg border border-border p-3">
              <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{idx + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </AppShell>
  );
}
