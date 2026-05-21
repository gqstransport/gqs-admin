export function getItemTimestamp(item) {
  if (item?.date) {
    const d = new Date(item.date);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  const id = Number(item?.id);
  if (!Number.isNaN(id) && id > 1e11) return id;
  return 0;
}

export function buildRecentActivity(blogs, projects, services, limit = 10) {
  const entries = [
    ...blogs.map((b) => ({
      id: `blog-${b.id}`,
      type: 'blog',
      label: 'Blog',
      title: b.title,
      meta: b.category,
      status: b.status,
      ts: getItemTimestamp(b),
    })),
    ...projects.map((p) => ({
      id: `project-${p.id}`,
      type: 'project',
      label: 'Project',
      title: p.title,
      meta: p.location,
      status: p.status,
      ts: getItemTimestamp(p),
    })),
    ...services.map((s) => ({
      id: `service-${s.id}`,
      type: 'service',
      label: 'Service',
      title: s.title,
      meta: s.categorySlug,
      status: s.status,
      ts: getItemTimestamp(s),
    })),
  ];

  return entries
    .filter((e) => e.ts > 0)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);
}

/** Last N days buckets for chart */
export function buildActivityChartData(blogs, projects, services, days = 7) {
  const now = new Date();
  const buckets = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      blog: 0,
      project: 0,
      service: 0,
      total: 0,
    });
  }

  const bucketMap = Object.fromEntries(buckets.map((b) => [b.key, b]));

  const add = (item, type) => {
    const ts = getItemTimestamp(item);
    if (!ts) return;
    const key = new Date(ts).toISOString().slice(0, 10);
    if (!bucketMap[key]) return;
    bucketMap[key][type] += 1;
    bucketMap[key].total += 1;
  };

  blogs.forEach((b) => add(b, 'blog'));
  projects.forEach((p) => add(p, 'project'));
  services.forEach((s) => add(s, 'service'));

  return buckets;
}

export function buildContentTotals(blogs, projects, services) {
  return [
    { key: 'blog', label: 'Blogs', count: blogs.length, color: '#2563eb' },
    { key: 'project', label: 'Projects', count: projects.length, color: '#e2b844' },
    { key: 'service', label: 'Services', count: services.length, color: '#059669' },
  ];
}
