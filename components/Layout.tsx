
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
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 sticky top-0 z-[50] transition-all duration-500">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
           <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
             {getPageTitle()}
             <span className="text-fire-red ml-1">.</span>
           </h1>
           <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs shadow-lg ring-2 ring-white">
             🚒
           </div>
        </div>
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
