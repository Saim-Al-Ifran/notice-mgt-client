// components/Sidebar.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  InboxIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type SidebarProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [openEmployee, setOpenEmployee] = useState(false);

  const NavItem = ({ href, label, Icon }: { href: string; label: string; Icon: any }) => (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0 bg-white dark:bg-gray-900 border-r">
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">N</div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">Nebs-IT</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Notice Management</div>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-auto">
          <NavItem href="/" label="Dashboard" Icon={HomeIcon} />

          <div>
            <button
              onClick={() => setOpenEmployee(!openEmployee)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-expanded={openEmployee}
            >
              <div className="flex items-center gap-3">
                <UsersIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Notice Board</span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${openEmployee ? "rotate-180" : ""}`} />
            </button>

            {openEmployee && (
              <div className="mt-2 ml-10 flex flex-col gap-1">
                <Link href="/notices" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">All Notices</Link>
                <Link href="/notices/new" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300">Add New Notice</Link>
              </div>
            )}
          </div>

 
        </nav>

        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200">AR</div>
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">Asif Riaj</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">HR Department</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">13 June, 2026</div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <nav
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Main menu"
        >
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">N</div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Nebs-IT</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Notice Management</div>
              </div>
            </div>

            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100">
              <HomeIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Dashboard</span>
            </Link>

            <button
              onClick={() => setOpenEmployee(!openEmployee)}
              className="flex items-center justify-between gap-3 px-2 py-2 rounded-md hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <UsersIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Employee</span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 ${openEmployee ? "rotate-180" : ""}`} />
            </button>

            {openEmployee && (
              <div className="ml-6 flex flex-col gap-1">
                <Link href="/employees" className="text-sm text-gray-600">Employee Database</Link>
                <Link href="/employees/new" className="text-sm text-gray-600">Add New Employee</Link>
                <Link href="/employees/performance" className="text-sm text-gray-600">Performance Report</Link>
                <Link href="/employees/history" className="text-sm text-gray-600">Performance History</Link>
              </div>
            )}

 
          </div>

          <div className="mt-[26rem] p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">AR</div>
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">Asif Riaj</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">HR Department</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">13 June, 2026</div>
          </div>
        </nav>
      </div>
    </>
  );
}
