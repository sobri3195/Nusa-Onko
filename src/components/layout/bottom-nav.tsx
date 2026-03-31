import { Heart, Home, ListTodo, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/projects', label: 'Projects', icon: ListTodo },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 p-2 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
