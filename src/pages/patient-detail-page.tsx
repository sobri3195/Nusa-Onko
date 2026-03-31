import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRTStore } from '@/lib/rt-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MobileActionBar, MobileAlertList, MobileHistoryAccordion, MobilePatientHeader } from '@/components/mobile/mobile-ui';

const sections = ['Overview', 'Imaging', 'Treatment', 'AI Results', 'Alerts', 'Timeline'] as const;

export function PatientDetailPage() {
  const { id = '' } = useParams();
  const { patients, getPatientExecutions, notifications } = useRTStore();
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]>('Overview');
  const patient = patients.find((p) => p.id === id);
  const execs = useMemo(() => getPatientExecutions(id), [getPatientExecutions, id]);

  if (!patient) return <div className="p-6">Patient not found</div>;

  const alertItems = notifications.filter((n) => n.patientId === id);

  return (
    <div className="space-y-3 p-3 md:p-6">
      <MobilePatientHeader name={patient.name} diagnosis={patient.diagnosis} age={patient.age} status={alertItems.length > 0 ? 'High Risk' : 'Stable'} />

      <div className="no-scrollbar -mx-1 flex overflow-x-auto px-1 pb-1">
        {sections.map((section) => (
          <Button key={section} variant={activeSection === section ? 'default' : 'outline'} className="mr-2 h-8 shrink-0" onClick={() => setActiveSection(section)}>
            {section}
          </Button>
        ))}
      </div>

      {activeSection === 'Overview' && <Card className="p-3 text-sm">Diagnosis: {patient.diagnosis} • Last adaptive replanning flagged for dose drift review.</Card>}
      {activeSection === 'Imaging' && <Card className="p-3 text-sm">Latest imaging sync tersedia. Tidak ada konflik contour baru dalam 24 jam.</Card>}
      {activeSection === 'Treatment' && <Card className="p-3 text-sm">VMAT 70Gy/35fx • Fraction berjalan: 19/35 • Setup variance median: 2.2 mm.</Card>}
      {activeSection === 'AI Results' && <MobileHistoryAccordion items={execs.map((e) => ({ id: e.id, title: `${e.moduleKey} — score ${e.result.score.toFixed(1)}`, detail: e.result.summary, meta: new Date(e.result.generatedAt).toLocaleString() }))} />}
      {activeSection === 'Alerts' && <MobileAlertList items={alertItems.map((a) => ({ id: a.id, title: a.moduleKey, detail: a.message, severity: a.severity }))} />}
      {activeSection === 'Timeline' && <MobileHistoryAccordion items={[
        { id: 'sim', title: 'Simulation completed', detail: 'CT simulation completed with immobilization mask.', meta: 'D-14' },
        { id: 'plan', title: 'Planning approved', detail: 'Plan approved by attending and physics.', meta: 'D-10' },
        { id: 'tx', title: 'Treatment running', detail: 'Daily fraction + AI checks.', meta: 'Today' }
      ]} />}

      <MobileActionBar>
        <Button className="flex-1">Run Module</Button>
        <Button className="flex-1" variant="outline">Save Result</Button>
        <Button className="flex-1" variant="outline">View Alerts</Button>
        <Button className="flex-1" variant="outline">Add Note</Button>
      </MobileActionBar>
    </div>
  );
}
