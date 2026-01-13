// app/notice/page.tsx
import React from "react";
import axios from "axios";
import NoticeListUI from "@/components/NoticeList";

export const metadata = {
  title: "Notice Board",
};

const API_BASE = process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";

type ApiResponse = {
  message?: string;
  data?: any[];
  pagination?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
};

async function fetchCount(status?: "Published" | "Draft") {
  try {
    const res = await axios.get<ApiResponse>(`${API_BASE}/api/v1/notice`, {
      params: {
        ...(status ? { status } : {}),
        page: 1,
        limit: 1, 
      },
      timeout: 5000,
    });

    return res.data?.pagination?.totalItems ?? (res.data?.data?.length ?? 0);
  } catch (err) {
    return 0;
  }
}

export default async function NoticePage() {
  // fetch counts in parallel on the server
  const [activeCount, draftCount] = await Promise.all([
    fetchCount("Published"),
    fetchCount("Draft"),
  ]);


  const draftDisplay = draftCount < 10 ? `0${draftCount}` : String(draftCount);
  const activeDisplay = activeCount < 10 ? `0${activeCount}` : String(activeCount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notice Management</h1>
          <div className="flex items-center space-x-4 mt-1 text-sm font-medium">
            <span className="text-green-600">Active Notices: {activeDisplay}</span>
            <span className="text-gray-400">|</span>
            <span className="text-orange-500">Draft Notice: {draftDisplay}</span>
          </div>
        </div>
      </div>

      <NoticeListUI />
    </div>
  );
}
