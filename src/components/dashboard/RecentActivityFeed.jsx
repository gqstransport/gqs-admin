import { FileText, Briefcase, Settings, Clock } from 'lucide-react';
import { buildRecentActivity } from '../../lib/activity';

const TYPE_META = {
  blog: { icon: FileText, className: 'bg-blue-100 text-blue-700' },
  project: { icon: Briefcase, className: 'bg-amber-100 text-amber-800' },
  service: { icon: Settings, className: 'bg-emerald-100 text-emerald-700' },
};

export default function RecentActivityFeed({ blogs, projects, services }) {
  const activity = buildRecentActivity(blogs, projects, services, 12);

  if (activity.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No activity yet. Create blogs, projects, or services to see updates here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {activity.map((item) => {
        const meta = TYPE_META[item.type];
        const Icon = meta.icon;
        const when = new Date(item.ts).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.className}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {item.label}
                </span>
                {item.status && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                    {item.status}
                  </span>
                )}
              </div>
              <p className="truncate font-semibold text-[var(--color-primary-navy)]">{item.title}</p>
              {item.meta && <p className="truncate text-xs text-gray-500">{item.meta}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              {when}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
