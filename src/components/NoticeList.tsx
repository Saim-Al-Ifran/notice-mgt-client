// components/NoticeListUI.tsx
"use client";
import React, { useState } from "react";
import FilterStatus from "./FilterStatus";
import NoticeTable from "./NoticeTable";
import Pagination from "./Pagination";
import NoticeCard from "./NoticeCard";
import Link from "next/link";

export type NoticeUI = {
  id: string;
  title: string;
  noticeType: string;
  target: string;
  publishedOn: string;
  status: "Published" | "Unpublished" | "Draft";
};

const MOCK: NoticeUI[] = [
  { id: "1", title: "Office closed on Friday for maintenance.", noticeType: "General / Company-W", target: "All Department", publishedOn: "2025-06-15", status: "Published" },
  { id: "2", title: "Eid al-Fitr holiday schedule.", noticeType: "Holiday & Event", target: "Finance", publishedOn: "2025-06-15", status: "Published" },
  { id: "3", title: "Updated code of conduct policy", noticeType: "HR & Policy Update", target: "Sales Team", publishedOn: "2025-06-15", status: "Published" },
  { id: "4", title: "Payroll for October will be processed on 28th", noticeType: "Finance & Payroll", target: "Web Team", publishedOn: "2025-06-15", status: "Published" },
  { id: "5", title: "System update scheduled for 30 Oct (9:00–11:00 PM)", noticeType: "IT / System Maintenance", target: "Database Team", publishedOn: "2025-06-15", status: "Published" },
  { id: "6", title: "Design team sprint review moved to Tuesday", noticeType: "Department / Team", target: "Admin", publishedOn: "2025-06-15", status: "Published" },
];

export default function NoticeList() {
  const [status, setStatus] = useState<"all" | "Published" | "Unpublished" | "Draft">("all");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = MOCK.filter((n) => status === "all" ? true : n.status === status);
  const total = filtered.length;
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <FilterStatus value={status} onChange={(v) => { setPage(1); setStatus(v); }} />
        <div className="flex items-center gap-3">
  {/* Create Notice */}
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
      </div>

      <Pagination page={page} total={total} perPage={perPage} onPageChange={setPage} />
    </div>
  );
}
