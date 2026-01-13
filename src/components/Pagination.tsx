"use client";
import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function PaginationUI({
  page,
  total,
  perPage,
  onPageChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-md
            text-gray-500 hover:bg-gray-100
            disabled:opacity-40 disabled:cursor-not-allowed
            cursor-pointer"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* Page Numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-9 w-9 rounded-md text-sm font-medium transition
              cursor-pointer
              ${
                p === page
                  ? "border border-indigo-500 text-indigo-600 bg-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ))}

        {/* Right Arrow */}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-md
            text-gray-500 hover:bg-gray-100
            disabled:opacity-40 disabled:cursor-not-allowed
            cursor-pointer"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
