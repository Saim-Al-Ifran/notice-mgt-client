// components/NoticeCardUI.tsx
"use client";
import React from "react";
import { NoticeUI } from "./NoticeList";

export default function NoticeCardUI({ notice }: { notice: NoticeUI }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{notice.title}</h3>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-300">{notice.noticeType}</div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Departments: <span className="font-medium text-gray-700 dark:text-gray-200">{notice.target}</span></div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Published on {new Date(notice.publishedOn).toLocaleDateString()}</div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${notice.status === "Published" ? "bg-green-100 text-green-800" : notice.status === "Draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}>
            {notice.status}
          </span>

          <div className="flex gap-2">
            <button className="text-xs text-indigo-600">View</button>
            <button className="text-xs text-gray-600">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
