'use client';

/**
 * Paginator — per-page selector + prev/next + count label.
 * Pass pageSize=Infinity for the "All" option.
 *
 * Props: total, page, pageSize, onPage, onPageSize, label (singular noun)
 */
export function Pagination({ total, page, pageSize, onPage, onPageSize, label = 'item' }) {
  const isAll = pageSize === Infinity || pageSize === 'all';
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const start = isAll ? (total === 0 ? 0 : 1) : (total === 0 ? 0 : Math.min(total, (page - 1) * pageSize + 1));
  const end   = isAll ? total : Math.min(total, page * pageSize);
  return (
    <div
      className="flex items-center justify-between gap-3 py-3 px-4 text-xs flex-wrap"
      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
    >
      <div className="flex items-center gap-1 tabular">
        Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{start}–{end}</span>
        of <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{total}</span> {label}{total === 1 ? '' : 's'}
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          Per page:
          <select
            value={isAll ? 'all' : pageSize}
            onChange={(e) => {
              const v = e.target.value;
              onPageSize(v === 'all' ? Infinity : Number(v));
              onPage(1);
            }}
            className="px-1.5 py-1 rounded text-xs"
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="all">All</option>
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(Math.max(1, page - 1))}
            disabled={page <= 1 || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition"
          >
            Prev
          </button>
          <span className="tabular px-2 text-stone-700">{isAll ? 1 : page}/{totalPages}</span>
          <button
            onClick={() => onPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isAll}
            className="px-2 py-1 rounded hover:bg-stone-100 disabled:opacity-30 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
