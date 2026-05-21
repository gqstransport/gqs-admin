import { buildActivityChartData, buildContentTotals } from '../../lib/activity';

const TYPE_COLORS = {
  blog: '#2563eb',
  project: '#e2b844',
  service: '#059669',
};

export default function ActivityChart({ blogs, projects, services }) {
  const chartData = buildActivityChartData(blogs, projects, services, 7);
  const totals = buildContentTotals(blogs, projects, services);
  const maxBar = Math.max(...chartData.map((d) => d.total), 1);
  const maxTotal = Math.max(...totals.map((t) => t.count), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-100 bg-white/60 p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-gray-400">
          Content overview
        </h3>
        <p className="mb-6 text-xs text-gray-500">Total items by type</p>
        <div className="flex h-48 items-end justify-center gap-10">
          {totals.map((t) => {
            const barPx = t.count ? Math.max((t.count / maxTotal) * 140, 16) : 6;
            return (
              <div key={t.key} className="flex flex-col items-center gap-2">
                <span className="text-lg font-black text-[var(--color-primary-navy)]">{t.count}</span>
                <div
                  className="w-14 rounded-t-lg transition-all duration-500"
                  style={{ height: `${barPx}px`, backgroundColor: t.color }}
                  title={`${t.label}: ${t.count}`}
                />
                <span className="text-xs font-bold text-gray-600">{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white/60 p-6">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-gray-400">
          Last 7 days
        </h3>
        <p className="mb-4 text-xs text-gray-500">New or updated content per day</p>
        <div className="mb-4 flex flex-wrap gap-3 text-xs font-medium">
          {Object.entries(TYPE_COLORS).map(([key, color]) => (
            <span key={key} className="flex items-center gap-1.5 capitalize text-gray-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {key === 'blog' ? 'Blogs' : key === 'project' ? 'Projects' : 'Services'}
            </span>
          ))}
        </div>
        <div className="flex h-48 items-end justify-between gap-2">
          {chartData.map((day) => {
            const maxPx = 160;
            const totalPx = day.total ? Math.max((day.total / maxBar) * maxPx, 12) : 4;
            const blogPx = day.total ? (day.blog / day.total) * totalPx : 0;
            const projectPx = day.total ? (day.project / day.total) * totalPx : 0;
            const servicePx = day.total ? (day.service / day.total) * totalPx : 0;
            return (
              <div key={day.key} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-gray-500">{day.total || ''}</span>
                <div
                  className="flex w-full max-w-[2.75rem] flex-col justify-end overflow-hidden rounded-t-md border border-gray-100"
                  style={{ height: `${totalPx}px` }}
                  title={`${day.label}: ${day.blog} blogs, ${day.project} projects, ${day.service} services`}
                >
                  {day.blog > 0 && (
                    <div style={{ height: `${blogPx}px`, backgroundColor: TYPE_COLORS.blog }} />
                  )}
                  {day.project > 0 && (
                    <div style={{ height: `${projectPx}px`, backgroundColor: TYPE_COLORS.project }} />
                  )}
                  {day.service > 0 && (
                    <div style={{ height: `${servicePx}px`, backgroundColor: TYPE_COLORS.service }} />
                  )}
                </div>
                <span className="w-full truncate text-center text-[9px] font-medium text-gray-400">
                  {day.label.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
