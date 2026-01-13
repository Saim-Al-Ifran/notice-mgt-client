// components/StatusBadge.tsx
import React from "react";

type Props = {
  status: "Published" | "Draft" | "Unpublished" | string;
};

export default function StatusBadge({ status }: Props) {
  // Normalize to known labels but display the label as-is
  const label = String(status);
  console.log(label)
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const styles: Record<string, string> = {
    Published: `${base} bg-green-50 text-green-700 border border-green-100`,
    Draft: `${base} bg-yellow-50 text-yellow-700 border border-yellow-100`,
    Unpublished: `${base} bg-gray-50 text-gray-700 border border-gray-100`,
  };

  const cls = styles[label] ?? `${base} bg-gray-50 text-gray-700 border border-gray-100`;

  return <span className={cls}>{label}</span>;
}
