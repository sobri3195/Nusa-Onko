import { Navigate, Route, Routes } from 'react-router-dom';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useProjects } from '@/hooks/useProjects';
import { FavoritesPage } from '@/pages/favorites-page';
import { HomePage } from '@/pages/home-page';
import { ProjectDetailPage } from '@/pages/project-detail-page';
import { ProjectFormPage } from '@/pages/project-form-page';
import { ProjectsPage } from '@/pages/projects-page';
import { SettingsPage } from '@/pages/settings-page';

function App() {
  const store = useProjects();

  return (
    <div className="mx-auto min-h-screen max-w-4xl p-3 pb-20 sm:p-4 md:pb-6">
      <Routes>
        <Route path="/" element={<HomePage projects={store.projects} onDelete={store.remove} />} />
        <Route path="/projects" element={<ProjectsPage projects={store.projects} onDelete={store.remove} onFavorite={store.toggleFavorite} />} />
        <Route path="/projects/new" element={<ProjectFormPage projects={store.projects} onCreate={store.create} onUpdate={store.update} />} />
        <Route path="/projects/:id" element={<ProjectDetailPage projects={store.projects} onDelete={store.remove} onFavorite={store.toggleFavorite} />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage projects={store.projects} onCreate={store.create} onUpdate={store.update} />} />
        <Route path="/favorites" element={<FavoritesPage projects={store.projects} onDelete={store.remove} onFavorite={store.toggleFavorite} />} />
        <Route path="/settings" element={<SettingsPage onReset={store.resetStorage} onRestore={store.restoreSeed} onRefresh={store.reload} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
