interface PaginationProps {
  /** Zero-based. */
  pageNo: number;
  totalPages: number;
  onChange: (pageNo: number) => void;
}

/** Page numbers around the current page, with ellipses for the gaps. */
function pageWindow(pageNo: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set([0, totalPages - 1, pageNo]);
  if (pageNo - 1 > 0) pages.add(pageNo - 1);
  if (pageNo + 1 < totalPages - 1) pages.add(pageNo + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const withGaps: (number | '…')[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) withGaps.push('…');
    withGaps.push(page);
  });

  return withGaps;
}

export function Pagination({ pageNo, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pager" aria-label="Pagination">
      <button
        type="button"
        className="btn"
        onClick={() => onChange(pageNo - 1)}
        disabled={pageNo === 0}
      >
        ← Previous
      </button>

      <div className="pager__pages">
        {pageWindow(pageNo, totalPages).map((page, index) =>
          page === '…' ? (
            <span key={`gap-${index}`} className="pager__ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className="pager__page"
              aria-current={page === pageNo}
              aria-label={`Page ${page + 1}`}
              onClick={() => onChange(page)}
            >
              {page + 1}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="btn"
        onClick={() => onChange(pageNo + 1)}
        disabled={pageNo >= totalPages - 1}
      >
        Next →
      </button>
    </nav>
  );
}
