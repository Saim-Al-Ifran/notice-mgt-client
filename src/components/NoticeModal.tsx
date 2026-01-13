// components/NoticeModal.tsx
"use client";
import React, { useEffect, useRef } from "react";
import StatusBadge from "./StatusBadge";
import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  notice?: {
    _id: string;
    targetRecipient?: string;
    noticeTitle?: string;
    employeeId?: string;
    employeeName?: string;
    position?: string;
    noticeType?: string;
    noticeBody?: string;
    publishDate?: string;
    attachmentUrl?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};

export default function NoticeModal({ open, onClose, loading, error, notice }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // focus close button when modal opens
    closeBtnRef.current?.focus();

    // close on ESC
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gradient-to-r from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notice Details</h3>
            {notice?.status && <StatusBadge status={notice.status === "Draft" ? "Unpublished" : (notice.status as any)} />}
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {loading && <div className="text-sm text-gray-600 dark:text-gray-300">Loading…</div>}

          {!loading && error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          {!loading && !error && !notice && (
            <div className="text-sm text-gray-600 dark:text-gray-300">No data available.</div>
          )}

          {!loading && !error && notice && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image / Attachment */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-full rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                  {notice.attachmentUrl ? (
                    <img
                      src={notice.attachmentUrl}
                      alt={notice.noticeTitle ?? "Attachment"}
                      className="w-full h-48 object-cover sm:h-56 md:h-48 lg:h-56"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400">
                      No attachment
                    </div>
                  )}
                </div>

                <div className="mt-3 w-full text-center">
                  <a
                    href={notice.attachmentUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md transition ${
                      notice.attachmentUrl
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-disabled={!notice.attachmentUrl}
                  >
                    View Attachment
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-4 text-sm text-gray-800 dark:text-gray-100">
                <div>
                  <div className="text-xs text-gray-500">Title</div>
                  <div className="text-base font-semibold">{notice.noticeTitle}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div>{notice.noticeType ?? "-"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Target</div>
                    <div>{notice.targetRecipient ?? "-"}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Publish Date</div>
                    <div>
                      {notice.publishDate
                        ? new Date(notice.publishDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div>{notice.status === "Draft" ? "Unpublished" : notice.status}</div>
                  </div>
                </div>

                {notice.employeeName && (
                  <div>
                    <div className="text-xs text-gray-500">Employee</div>
                    <div>{notice.employeeName} {notice.employeeId ? `(${notice.employeeId})` : ""}</div>
                  </div>
                )}

                {notice.position && (
                  <div>
                    <div className="text-xs text-gray-500">Position</div>
                    <div>{notice.position}</div>
                  </div>
                )}

                {notice.noticeBody && (
                  <div>
                    <div className="text-xs text-gray-500">Body</div>
                    <div className="whitespace-pre-wrap rounded-md p-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent">
                      {notice.noticeBody}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div>Created: {notice.createdAt ? new Date(notice.createdAt).toLocaleString() : "-"}</div>
                  <div>Updated: {notice.updatedAt ? new Date(notice.updatedAt).toLocaleString() : "-"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
