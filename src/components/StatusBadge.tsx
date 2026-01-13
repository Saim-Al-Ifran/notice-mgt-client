
/* ----------------- Status Badge ----------------- */

import { NoticeUI } from "./NoticeTable";

export default function StatusBadge({ status }: { status: NoticeUI["status"] }) {
  const styles =
    status === "Published"
      ? "bg-green-100 text-green-700"
      : status === "Draft"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}