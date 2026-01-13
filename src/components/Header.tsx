// components/Header.tsx
"use client";
import { Bars3Icon, BellIcon} from "@heroicons/react/24/outline";

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export default function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Good Afternoon Asif</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">13 June, 2026</p>
            </div>
          </div>
 

          {/* Right: Actions + User */}
          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-800 dark:text-white">Asif Riaj</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">HR Department</div>
              </div>

              <div
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-200"
                aria-hidden
              >
                AR
              </div>
            </div>
          </div>
        </div>
      </div>

 
    </header>
  );
}
