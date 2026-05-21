import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Blogs', path: '/blogs', icon: <FileText size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
    { name: 'Services', path: '/services', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[var(--color-primary-navy)] text-white shadow-xl z-10">
      <div className="p-6 text-2xl font-black tracking-tight text-[var(--color-accent-gold)] border-b border-white/10">
        GQS ADMIN
      </div>
      <nav className="flex-1 mt-6">
        <ul>
          {links.map((link) => {
            const isActive = location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/');
            return (
              <li key={link.name} className="px-4 py-2">
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--color-secondary-blue)] text-[var(--color-accent-gold)] font-bold shadow-md'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 text-sm text-gray-400 text-center">
        v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
