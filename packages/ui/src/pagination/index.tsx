"use client";

import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(maxVisible, totalPages);
    }
    if (currentPage >= totalPages - half) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    if (showFirstLast && start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showFirstLast && end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className={`flex items-center justify-center gap-1 ${className || ""}`}>
      {showFirstLast && (
        <motion.button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
        >
          First
        </motion.button>
      )}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
        whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
      >
        Previous
      </motion.button>

      {getVisiblePages().map((page, index) => {
        if (page === "...") {
          return <span key={`ellipsis-${index}`} className="px-2">...</span>;
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <motion.button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`
              px-4 py-2 rounded
              ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {pageNum}
          </motion.button>
        );
      })}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
        whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
      >
        Next
      </motion.button>
      {showFirstLast && (
        <motion.button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
        >
          Last
        </motion.button>
      )}
    </nav>
  );
};

