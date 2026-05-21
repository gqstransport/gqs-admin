import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChangePasswordModal from './ChangePasswordModal';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

const Layout = ({ onLogout }) => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const initial = user?.email?.[0]?.toUpperCase() || 'A';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface-soft)] font-sans">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm sm:px-8">
          <h2 className="text-lg font-bold tracking-tight text-[var(--color-primary-navy)] sm:text-xl">
            Management Portal
          </h2>
          <UserMenu
            email={user?.email || 'Admin'}
            initial={initial}
            onPassword={() => setShowPasswordModal(true)}
            onLogout={onLogout}
          />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};

export default Layout;

