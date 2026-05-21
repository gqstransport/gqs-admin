import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { FileText, Briefcase, Settings } from 'lucide-react';
import ActivityChart from '../components/dashboard/ActivityChart';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';

const DashboardCard = ({ title, count, icon, colorClass }) => (
  <div className="glass flex items-center gap-6 rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1">
    <div className={`rounded-lg p-4 text-white shadow-lg ${colorClass}`}>{icon}</div>
    <div>
      <p className="font-medium text-gray-500">{title}</p>
      <h3 className="text-3xl font-black text-[var(--color-primary-navy)]">{count}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { blogs, projects, services } = useAdmin();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-primary-navy)]">Dashboard Overview</h1>
        <p className="mt-2 text-gray-500">Welcome back! Here&apos;s a summary of your website content.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

      <div className="glass rounded-xl p-8">
        <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-bold text-[var(--color-primary-navy)]">
          Content analytics
        </h2>
        <ActivityChart blogs={blogs} projects={projects} services={services} />
      </div>

      <div className="glass rounded-xl p-8">
        <h2 className="mb-6 border-b border-gray-100 pb-4 text-xl font-bold text-[var(--color-primary-navy)]">
          Recent activity
        </h2>
        <RecentActivityFeed blogs={blogs} projects={projects} services={services} />
      </div>
    </div>
  );
};

export default Dashboard;
