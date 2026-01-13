// components/NoticeListUI.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import FilterStatus from "./FilterStatus";
import NoticeTable from "./NoticeTable";
import Pagination from "./Pagination";
import NoticeCard from "./NoticeCard";
import Link from "next/link";
import api from "@/lib/axios";

export type NoticeUI = {
  id: string;
  title: string;
  noticeType: string;
  target: string;
  publishedOn: string;
  status: "Published" | "Unpublished" | "Draft";
};

export default function NoticeList() {
  const [status, setStatus] = useState<"all" | "Published" | "Draft">("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [items, setItems] = useState<NoticeUI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      params.set("page", String(page));
      params.set("limit", String(perPage));

      const res = await api.get(`/api/v1/notice?${params.toString()}`);
      const json = res.data;

      const mapped: NoticeUI[] = (json.data || []).map((n: any) => ({
        id: n._id,
        title: n.noticeTitle,
        noticeType: n.noticeType,
        target: n.targetRecipient,
        publishedOn: n.publishDate ? new Date(n.publishDate).toISOString().slice(0, 10) : "",
        status: n.status === "Draft" ? "Unpublished" : (n.status as "Published" | "Draft" | "Unpublished"),
      }));

      setItems(mapped);
      setTotal(json.pagination?.totalItems ?? mapped.length);

      // If current page is out of range, clamp it
      const totalPages = json.pagination?.totalPages ?? Math.ceil((json.pagination?.totalItems ?? mapped.length) / perPage);
      if (totalPages > 0 && page > totalPages) {
        setPage(totalPages);
      }
    } catch (e: any) {
      setError(e.response?.data?.message ?? e.message ?? "Failed to fetch notices");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, page, perPage]);

  // initial & reactive fetch
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // Reset to first page when status changes
  useEffect(() => {
    setPage(1);
  }, [status]);

  // Listen for global status-updated events and refresh list
  useEffect(() => {
    const onUpdated = (e: any) => {
      // If event provides detail with id and status, you could update in-place.
      // For simplicity, re-fetch current page to keep server in sync.
      fetchNotices();
    };
    window.addEventListener("notice:status-updated", onUpdated as EventListener);
    return () => window.removeEventListener("notice:status-updated", onUpdated as EventListener);
  }, [fetchNotices]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <FilterStatus value={status} onChange={(v) => setStatus(v)} />
        <div className="flex items-center gap-3">
          <Link
            href="/notices/new"
            className="
              inline-flex items-center gap-2
              px-4 py-2.5
              bg-orange-500 hover:bg-orange-600
              text-white text-sm font-medium
              rounded-lg
              transition
            "
          >
            <span className="text-lg leading-none">+</span>
            Create Notice
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading && (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-300">Loading notices…</div>
        )}

        {!loading && error && (
          <div className="p-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
            <div>{error}</div>
            <button
              onClick={() => fetchNotices()}
              className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-200"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-300">No notices found.</div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <NoticeTable items={items} />
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y">
              {items.map((n) => (
                <NoticeCard key={n.id} notice={n} />
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination page={page} total={total} perPage={perPage} onPageChange={(p) => setPage(p)} />
    </div>
  );
}
