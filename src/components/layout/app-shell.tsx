import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AppLogo } from '@/components/branding/app-logo';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Patients', to: '/patients' },
  { label: 'Clinical Workflow', to: '/workflow' },
  { label: 'AI Modules', to: '/modules/autocontour-one' },
  { label: 'Alerts', to: '/alerts' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' }
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-3 py-4 md:px-6">
      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-3">
          <div className="mb-4 flex items-center gap-3">
            <AppLogo className="h-10 w-10" />
            <h1 className="text-lg font-semibold text-primary">OnkoAI RT Platform</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn('block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground', isActive && 'bg-primary text-primary-foreground hover:text-primary-foreground')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            AI Modules: AutoContour-One, Dose-Drift Detector, Mucositis-Cam, PneumoShield, PlanPilot-VMAT, Setup-Error Zero, RT-DocWatch, Hippocampus-Saver AI, WaitList-Fair, LiverRILD-Guard.
          </div>
        </aside>
        <main className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
