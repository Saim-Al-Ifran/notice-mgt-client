// app/layout.tsx
"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = sidebarOpen ? "hidden" : original;
    return () => {
      document.body.style.overflow = original;
    };
  }, [sidebarOpen]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex h-screen">
          {/* Pass both open and setter */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <div className="flex-1 flex flex-col">
            {/* Pass setter so Header can open the drawer */}
            <Header setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
