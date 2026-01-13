// components/StatusUpdateModal.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";

type Props = {
  open: boolean;
  onClose: () => void;
  id: string | null;
  currentStatus?: "Published" | "Draft" | "Unpublished" | null;
};

export default function StatusUpdateModal({ open, onClose, id, currentStatus }: Props) {
  const [selected, setSelected] = useState<"Published" | "Unpublished">("Published");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(false);
    if (currentStatus === "Draft") setSelected("Unpublished");
    else if (currentStatus === "Published") setSelected("Published");
    else setSelected("Published");
    setTimeout(() => closeBtnRef.current?.focus(), 50);
  }, [open, currentStatus]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!id) {
      setError("Missing notice id");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const apiStatus = selected === "Unpublished" ? "Draft" : "Published";
      await api.patch(`/api/v1/notice/${id}/status`, { status: apiStatus });


      const uiStatus = apiStatus === "Draft" ? "Unpublished" : "Published";
      window.dispatchEvent(new CustomEvent("notice:status-updated", { detail: { id, status: uiStatus } }));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg mx-auto transform transition-all">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 border-b dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Update Notice Status</h3>
              <div className="text-xs text-gray-500">ID: <span className="font-medium text-gray-700 dark:text-gray-200">{id ?? "—"}</span></div>
            </div>

            <div className="flex items-center gap-2">
              {success ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm">Updated</span>
                </div>
              ) : (
                <button ref={closeBtnRef} onClick={onClose} className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Choose the new status for this notice. This will change visibility for recipients.
            </div>

            <div className="grid gap-3">
              <label className={`flex items-start gap-3 p-3 rounded-lg border ${selected === "Published" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"} cursor-pointer`}>
                <input type="radio" name="status" value="Published" checked={selected === "Published"} onChange={() => setSelected("Published")} className="mt-1 h-4 w-4 text-indigo-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Published</div>
                    <div className="text-xs text-gray-500">Visible</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Publish immediately so recipients can see the notice.</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-lg border ${selected === "Unpublished" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"} cursor-pointer`}>
                <input type="radio" name="status" value="Unpublished" checked={selected === "Unpublished"} onChange={() => setSelected("Unpublished")} className="mt-1 h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Unpublished</div>
                    <div className="text-xs text-gray-500">Draft</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Save as draft; recipients will not see this notice.</div>
                </div>
              </label>
            </div>

            {currentStatus === "Draft" && selected === "Published" && (
              <div className="mt-4 flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-md border border-indigo-100 dark:border-indigo-800">
                <ExclamationTriangleIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div className="text-sm text-indigo-700 dark:text-indigo-200">Publishing a draft will make it visible to recipients immediately.</div>
              </div>
            )}

            {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
          </div>

          <div className="px-5 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">Current: <span className="font-medium text-gray-700 dark:text-gray-200">{currentStatus === "Draft" ? "Unpublished (Draft)" : currentStatus ?? "—"}</span></div>

            <div className="flex items-center gap-2">
              <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>

              <button onClick={handleSubmit} disabled={loading || success} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white ${loading || success ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"} transition`}>
                {loading ? (
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                ) : success ? <CheckCircleIcon className="h-5 w-5" /> : null}
                <span>{loading ? "Updating…" : success ? "Updated" : "Update Status"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
