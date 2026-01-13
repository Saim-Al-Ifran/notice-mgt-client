// components/FilterStatusUI.tsx
"use client";
import React from "react";

/* ===== Shared Field Style ===== */
const fieldBase =
  "w-full h-11 rounded-lg border border-[#D0D5DD] bg-white px-3 text-sm text-gray-700 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 " +
  "transition";

/* ===== Custom Select Wrapper ===== */
function SelectField<T extends string>({
  value,
  onChange,
  children,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${fieldBase} appearance-none pr-10 ${className}`}
      >
        {children}
      </select>

      {/* Custom Arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        ▼
      </span>
    </div>
  );
}

export default function FilterStatusUI({
  value,
  onChange,
}: {
  value: "all" | "Published" | "Unpublished" | "Draft";
  onChange: (v: "all" | "Published" | "Unpublished" | "Draft") => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Status
      </label>
      <SelectField<"all" | "Published" | "Unpublished" | "Draft">
        value={value}
        onChange={onChange}
      >
        <option value="all">All</option>
        <option value="Published">Published</option>
        <option value="Unpublished">Unpublished</option>
        <option value="Draft">Draft</option>
      </SelectField>
    </div>
  );
}
