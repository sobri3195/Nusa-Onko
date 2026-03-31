import { Navigate, Route, Routes } from 'react-router-dom';
import { RTDashboardPage } from '@/pages/rt-dashboard-page';
import { RTPatientsPage } from '@/pages/rt-patients-page';
import { RTPatientDetailPage } from '@/pages/rt-patient-detail-page';
import { RTWorkflowPage } from '@/pages/rt-workflow-page';
import { RTModulePage } from '@/pages/rt-modules-page';
import { RTAlertsPage } from '@/pages/rt-alerts-page';
import { RTReportsPage } from '@/pages/rt-reports-page';
import { RTSettingsPage } from '@/pages/rt-settings-page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RTDashboardPage />} />
      <Route path="/patients" element={<RTPatientsPage />} />
      <Route path="/patients/:id" element={<RTPatientDetailPage />} />
      <Route path="/workflow" element={<RTWorkflowPage />} />
      <Route path="/modules/:moduleKey" element={<RTModulePage />} />
      <Route path="/alerts" element={<RTAlertsPage />} />
      <Route path="/reports" element={<RTReportsPage />} />
      <Route path="/settings" element={<RTSettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
