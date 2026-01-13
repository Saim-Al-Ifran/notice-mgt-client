// hooks/useNoticesAxios.ts
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios"; 
import type { NoticeUI } from "@/components/NoticeList";

type ApiNotice = {
  _id: string;
  targetRecipient: string;
  noticeTitle: string;
  noticeType: string;
  publishDate?: string;
  status: string;
};

type ApiResponse = {
  message?: string;
  data: ApiNotice[];
  pagination?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
};

export function useNoticesAxios(
  status: "all" | "Published" | "Unpublished" | "Draft",
  page: number,
  perPage = 10
) {
  const [items, setItems] = useState<NoticeUI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiStatusParam = useMemo(() => {
    if (status === "all") return undefined;
    if (status === "Unpublished") return "Draft";
    return status;
  }, [status]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (apiStatusParam) params.set("status", apiStatusParam);
    params.set("page", String(page));
    params.set("limit", String(perPage));
    return params.toString();
  }, [apiStatusParam, page, perPage]);

  useEffect(() => {
    const controller = new AbortController(); // axios supports signal
    setLoading(true);
    setError(null);

    api
      .get<ApiResponse>(`/api/v1/notice?${query}`, { signal: controller.signal })
      .then((res) => {
        const json = res.data;
        const mapped: NoticeUI[] = (json.data || []).map((n) => ({
          id: n._id,
          title: n.noticeTitle,
          noticeType: n.noticeType,
          target: n.targetRecipient,
          publishedOn: n.publishDate ? new Date(n.publishDate).toISOString().slice(0, 10) : "",
          status: n.status === "Draft" ? "Draft" : n.status === "Published" ? "Published" : "Unpublished",
        })) as unknown as NoticeUI[];
        setItems(mapped);
        setTotal(json.pagination?.totalItems ?? mapped.length);
      })
      .catch((err) => {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // request cancelled, ignore
          return;
        }
        setError(err.response?.data?.message ?? err.message ?? "Failed to fetch notices");
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  return { items, total, loading, error };
}
