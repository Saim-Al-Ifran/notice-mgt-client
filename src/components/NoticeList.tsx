// components/NoticeListUI.tsx
"use client";
import React, { useState, useEffect } from "react";
import FilterStatus from "./FilterStatus";
import NoticeTable from "./NoticeTable";
import Pagination from "./Pagination";
import NoticeCard from "./NoticeCard";
import Link from "next/link";
import { useNoticesAxios } from "@/hooks/useNoticesAxios";

export type NoticeUI = {
  id: string;
  title: string;
  noticeType: string;
  target: string;
  publishedOn: string;
  status: "Published" | "Draft";
};

export default function NoticeList() {
  const [status, setStatus] = useState<"all" | "Published" | "Draft">("all");
  const [page, setPage] = useState(1);
  const perPage = 1;

  const { items, total, loading, error } = useNoticesAxios(status, page, perPage);

  useEffect(() => {
    setPage(1);
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <FilterStatus value={status} onChange={(v) => setStatus(v)} />
        <div className="flex items-center gap-3">
          <Link href="/notices/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition">
            <span className="text-lg leading-none">+</span>
            Create Notice
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading && <div className="p-4 text-sm text-gray-600 dark:text-gray-300">Loading notices…</div>}
        {!loading && error && <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="p-4 text-sm text-gray-600 dark:text-gray-300">No notices found.</div>}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="hidden sm:block">
              <NoticeTable items={items} />
            </div>
            <div className="sm:hidden divide-y">
              {items.map((n) => <NoticeCard key={n.id} notice={n} />)}
            </div>
          </>
        )}
      </div>

      <Pagination page={page} total={total} perPage={perPage} onPageChange={setPage} />
    </div>
  );
}
