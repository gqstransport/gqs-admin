import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from '../context/AuthContext';

const Layout = ({ onLogout }) => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const initial = user?.email?.[0]?.toUpperCase() || 'A';

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-soft)] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[var(--color-primary-navy)]">Management Portal</h2>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-secondary-blue)] text-white flex items-center justify-center font-bold">
                {initial}
              </div>
              <span className="hidden sm:inline">{user?.email || 'Admin'}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded text-gray-500 hover:bg-gray-50"
            >
              Password
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded text-gray-500 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};

export default Layout;

