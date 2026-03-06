const Pagination = ({ payload, totalPages, handlePageChange }) => {
  let { page } = payload;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, page - half);
    let endPage = Math.min(totalPages, page + half);

    if (page <= half) {
      startPage = 1;
      endPage = Math.min(maxPagesToShow, totalPages);
    }

    if (page + half >= totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <nav
        className="flex items-center justify-center gap-x-1 p-4"
        aria-label="Pagination"
      >
        {/* Previous Button */}
        <button
          type="button"
          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-50 focus:bg-green-900 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          aria-label="Previous"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || totalPages === 0}
        >
          <svg
            className="size-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span className="sr-only">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-x-1">
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`flex min-h-[30px] min-w-[30px] items-center justify-center rounded-lg text-sm ${
                pageNumber === page
                  ? "bg-blue-900 text-white"
                  : "text-gray-800 hover:bg-gray-50 focus:bg-blue-900 focus:text-white"
              } focus:outline-none`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {/* Ellipsis */}
          {totalPages > 5 && page + 2 < totalPages && (
            <div className="hs-tooltip inline-block">
              <button
                type="button"
                className="hs-tooltip-toggle group flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg p-2 text-sm text-gray-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="text-xs hover:text-blue-900">•••</span>
              </button>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="jusify-center inline-flex min-h-[38px] min-w-[38px] items-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-50 focus:bg-blue-900 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          aria-label="Next"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          <svg
            className="size-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
          <span className="sr-only">Next</span>
        </button>
      </nav>
    </>
  );
};

export default Pagination;
