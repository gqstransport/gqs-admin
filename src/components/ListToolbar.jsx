import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react';
import Pagination from './Pagination';

export default function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filterFields = [],
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 24],
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
}) {
  return (
    <div className="glass space-y-4 rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--color-accent-gold)] focus:ring-2 focus:ring-[var(--color-accent-gold)]/30"
          />
        </div>

        {showViewToggle && onViewModeChange && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'table'
                  ? 'bg-white text-[var(--color-primary-navy)] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
              Table
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'cards'
                  ? 'bg-white text-[var(--color-primary-navy)] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </button>
          </div>
        )}
      </div>

      {filterFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </span>
          {filterFields.map(({ key, label, value, onChange, options }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-500">{label}</span>
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-primary-navy)] outline-none focus:border-[var(--color-accent-gold)]"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            Showing {filteredCount} of {totalCount}
          </span>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
        totalCount={filteredCount}
      />
    </div>
  );
}
