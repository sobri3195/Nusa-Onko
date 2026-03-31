import { Bell, Blocks, FileText, Home, Users } from 'lucide-react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RTStoreProvider, useRTStore } from '@/lib/rt-store';
import { PatientsPage } from '@/pages/patients-page';
import { PatientDetailPage } from '@/pages/patient-detail-page';
import { ModulesOverviewPage } from '@/pages/modules-overview-page';
import { ModuleDetailPage } from '@/pages/module-detail-page';
import { AlertsCenterPage } from '@/pages/alerts-center-page';
import { ReportsPage } from '@/pages/reports-page';
import { MobileBottomNav, MobileTopBar } from '@/components/mobile/mobile-ui';
import { cn } from '@/lib/utils';

const desktopItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/modules', label: 'Modules', icon: Blocks },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/reports', label: 'Profile/Reports', icon: FileText }
];

function Layout() {
  const { notifications } = useRTStore();
  const location = useLocation();
  const pageTitle = location.pathname.startsWith('/patients/') ? 'Patient Detail' :
    location.pathname.startsWith('/patients') ? 'Patients' :
      location.pathname.startsWith('/modules/') ? 'Module Detail' :
        location.pathname.startsWith('/modules') ? 'AI Modules' :
          location.pathname.startsWith('/alerts') ? 'Alerts Center' :
            location.pathname.startsWith('/reports') ? 'Reports & Settings' : 'Clinical Dashboard';

  return (
    <div className="min-h-screen bg-muted/30">
      <MobileTopBar title={pageTitle} onSearch={() => undefined} onFilter={() => undefined} />
      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-border bg-card p-4 md:block">
          <h1 className="mb-4 text-lg font-semibold">OnkoAI RT Platform</h1>
          <nav className="space-y-1">
            {desktopItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted', isActive && 'bg-primary text-primary-foreground hover:bg-primary')}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="pb-28 md:pb-6">
          <Routes>
            <Route path="/" element={<Navigate to="/modules" replace />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/modules" element={<ModulesOverviewPage />} />
            <Route path="/modules/:moduleKey" element={<ModuleDetailPage />} />
            <Route path="/alerts" element={<AlertsCenterPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
      <MobileBottomNav alertCount={notifications.length} />
    </div>
  );
}

function App() {
  return <RTStoreProvider><Layout /></RTStoreProvider>;
}

export default App;
