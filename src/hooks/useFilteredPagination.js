import { useEffect, useMemo, useState } from 'react';

/**
 * @param {Array} items
 * @param {{
 *   searchFields?: string[],
 *   filterFns?: Record<string, (item: object, value: string) => boolean>,
 *   sortFn?: (a: object, b: object) => number,
 *   pageSize?: number,
 *   defaultView?: 'table' | 'cards',
 * }} options
 */
export function useFilteredPagination(items, options = {}) {
  const {
    searchFields = ['title'],
    filterFns = {},
    sortFn = () => 0,
    pageSize: initialPageSize = 9,
    defaultView = 'table',
  } = options;

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [viewMode, setViewMode] = useState(defaultView);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    let result = [...(items || [])];
    const q = search.trim().toLowerCase();

    if (q) {
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          if (Array.isArray(val)) {
            return val.some((v) => String(v).toLowerCase().includes(q));
          }
          return String(val ?? '').toLowerCase().includes(q);
        })
      );
    }

    Object.entries(filterFns).forEach(([key, fn]) => {
      const val = filters[key];
      if (val && val !== 'all') {
        result = result.filter((item) => fn(item, val));
      }
    });

    return result.sort(sortFn);
  }, [items, search, filters, searchFields, filterFns, sortFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize) || 1);

  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    search,
    setSearch,
    filters,
    setFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    viewMode,
    setViewMode,
    filtered,
    paginated,
    totalPages,
    totalCount: filtered.length,
  };
}
