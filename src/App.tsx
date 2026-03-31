import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { RTStoreProvider } from '@/lib/rt-store';
import { PatientsPage } from '@/pages/patients-page';
import { PatientDetailPage } from '@/pages/patient-detail-page';
import { ModulesOverviewPage } from '@/pages/modules-overview-page';
import { ModuleDetailPage } from '@/pages/module-detail-page';
import { AlertsCenterPage } from '@/pages/alerts-center-page';
import { ReportsPage } from '@/pages/reports-page';

function Nav() {
  return <nav className="flex gap-4 border-b p-4 text-sm"><Link to="/patients">Patients</Link><Link to="/modules">Modules</Link><Link to="/alerts">Alerts</Link><Link to="/reports">Reports</Link></nav>;
}

function App() {
  return <RTStoreProvider><Nav /><Routes>
    <Route path="/" element={<Navigate to="/modules" replace />} />
    <Route path="/patients" element={<PatientsPage />} />
    <Route path="/patients/:id" element={<PatientDetailPage />} />
    <Route path="/modules" element={<ModulesOverviewPage />} />
    <Route path="/modules/:moduleKey" element={<ModuleDetailPage />} />
    <Route path="/alerts" element={<AlertsCenterPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Routes></RTStoreProvider>;
}

export default App;
