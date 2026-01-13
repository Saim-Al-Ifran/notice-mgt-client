
/* ----------------- Action Menu ----------------- */

import { useState } from "react";
import { NoticeUI } from "./NoticeTable";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function ActionMenu({ status }: { status: NoticeUI["status"] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-500 hover:text-indigo-600 focus:outline-none"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-white shadow-lg border border-gray-200">
          <div className="px-3 py-2 text-sm text-gray-700 flex items-center justify-between">
            <span>{status === "Published" ? "Published" : "Unpublished"}</span>
            <input
              type="checkbox"
              checked={status === "Published"}
              readOnly
              className="h-4 w-8 accent-green-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}