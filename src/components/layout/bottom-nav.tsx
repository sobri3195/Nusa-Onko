import { Blocks, Heart, Home, ListTodo, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/projects', label: 'Projects', icon: ListTodo },
  { to: '/modules', label: 'Modules', icon: Blocks },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex flex-col items-center gap-1 p-2 text-xs transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
