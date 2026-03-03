const Pagination = ({
   currentPage,
   totalPages, 
   onPageChange 
  }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full bg-slate-200/50 disabled:opacity-40  cursor-pointer"
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M22.499 12.85L16.25 19.1a1 1 0 0 0 0 1.414l6.25 6.25"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2 text-sm font-medium">
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer
                ${
                  page === currentPage
                    ? "text-indigo-500 border border-indigo-200"
                    : ""
                }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full bg-slate-200/50 disabled:opacity-40  cursor-pointer"
      >
        <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M22.499 12.85L16.25 19.1a1 1 0 0 0 0 1.414l6.25 6.25"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
