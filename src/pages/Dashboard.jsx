import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { FileText, Briefcase, Settings } from 'lucide-react';

const DashboardCard = ({ title, count, icon, colorClass }) => (
  <div className="glass p-6 rounded-xl flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300">
    <div className={`p-4 rounded-lg ${colorClass} text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 font-medium">{title}</p>
      <h3 className="text-3xl font-black text-[var(--color-primary-navy)]">{count}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { blogs, projects, services } = useAdmin();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-primary-navy)]">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's a summary of your website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Blog Posts" 
          count={blogs.length} 
          icon={<FileText size={28} />}
          colorClass="bg-blue-600"
        />
        <DashboardCard 
          title="Portfolio Projects" 
          count={projects.length} 
          icon={<Briefcase size={28} />}
          colorClass="bg-[var(--color-accent-gold)]"
        />
        <DashboardCard 
          title="Active Services" 
          count={services.length} 
          icon={<Settings size={28} />}
          colorClass="bg-emerald-600"
        />
      </div>

      <div className="mt-12 glass p-8 rounded-xl">
        <h2 className="text-xl font-bold text-[var(--color-primary-navy)] mb-6 pb-4 border-b border-gray-100">Recent Activity</h2>
        <div className="text-center py-12 text-gray-400">
          Activity feed will be available in the next update.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
