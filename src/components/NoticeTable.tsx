// components/NoticeTableUI.tsx
"use client";
import React, { useState } from "react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import StatusBadge from "./StatusBadge";
import ActionMenu from "./ActionMenu";
import NoticeModal from "./NoticeModal";
import StatusUpdateModal from "./StatusUpdateModal";
import api from "@/lib/axios";

export type NoticeUI = {
  id: string;
  title: string;
  noticeType: string;
  target: string;
  publishedOn: string;
  status: "Published" | "Draft" | "Unpublished";
};

export default function NoticeTableUI({ items }: { items: NoticeUI[] }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [notice, setNotice] = useState<any | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState<string | null>(null);
  const [statusCurrent, setStatusCurrent] = useState<"Published" | "Draft" | "Unpublished" | null>(null);

  // View modal
  const openModalWith = async (id: string) => {
    setViewModalOpen(true);
    setLoadingView(true);
    setViewError(null);
    setNotice(null);
    try {
      const res = await api.get(`/api/v1/notice/${id}`);
      setNotice(res.data?.data ?? null);
    } catch (err: any) {
      setViewError(err.response?.data?.message ?? err.message ?? "Failed to load notice");
    } finally {
      setLoadingView(false);
    }
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setNotice(null);
    setViewError(null);
    setLoadingView(false);
  };

  // Status modal open (pass exact status so UI shows it verbatim)
  const openStatusModal = (id: string, currentStatus: "Published" | "Draft" | "Unpublished") => {
    setStatusTargetId(id);
    setStatusCurrent(currentStatus);
    setStatusModalOpen(true);
  };
  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusTargetId(null);
    setStatusCurrent(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" /></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Notice Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Departments/Individual</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Published On</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">No notices found</td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-4 py-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300" /></td>

                  <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-100">{n.title}</td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{n.noticeType}</td>

                  <td className="px-4 py-4 text-sm font-medium text-indigo-600">{n.target}</td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(n.publishedOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>

                  <td className="px-4 py-4">
                    {/* Show status exactly as Published / Draft / Unpublished */}
                    <StatusBadge status={n.status} />
                    
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <button onClick={() => openModalWith(n.id)} className="text-gray-500 hover:text-indigo-600" aria-label={`View notice ${n.title}`}>
                        <EyeIcon className="h-5 w-5" />
                      </button>

                      <button onClick={() => openStatusModal(n.id, n.status)} className="text-gray-500 hover:text-indigo-600" aria-label={`Update status for ${n.title}`}>
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>

                      <ActionMenu status={n.status} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NoticeModal open={viewModalOpen} onClose={closeViewModal} loading={loadingView} error={viewError} notice={notice} />

      <StatusUpdateModal open={statusModalOpen} onClose={closeStatusModal} id={statusTargetId} currentStatus={statusCurrent} />
    </>
  );
}
