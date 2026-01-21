
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User } from '../types';

interface LayoutProps {
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ currentUser }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Tableau de Bord';
      case '/trainings': return 'Catalogue';
      case '/create': return 'Création';
      case '/personnel': return 'Effectifs';
      case '/profile': return 'Mon Profil';
      default: return 'FireTrained';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-fire-red text-white p-4 sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold tracking-tight text-center">
          {getPageTitle()}
        </h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-2xl">
        <Outlet />
      </main>

      {/* Bottom Navigation (TabBar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
        <NavItem to="/" icon="📊" label="Dash" />
        <NavItem to="/trainings" icon="🚒" label="Stages" />
        
        {/* Onglet CRÉER : Visible pour Formateurs OU Admins */}
        {(currentUser?.isTrainer || currentUser?.isAdmin) && (
          <NavItem to="/create" icon="➕" label="Créer" />
        )}
        
        {/* Onglet STAFF : Visible uniquement pour Admins */}
        {currentUser?.isAdmin && (
          <NavItem to="/personnel" icon="👥" label="Staff" />
        )}
        
        <NavItem to="/profile" icon="👤" label="Profil" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
          isActive ? 'text-fire-red font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`
      }
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </NavLink>
  );
};

export default Layout;
