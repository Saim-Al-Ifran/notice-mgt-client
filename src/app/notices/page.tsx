// app/notice/page.tsx
import NoticeListUI from "@/components/NoticeList";

export const metadata = {
  title: "Notice Board",
};

export default function NoticePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notice Management</h1>
          <div className="flex items-center space-x-4 mt-1 text-sm font-medium">
            <span className="text-green-600">Active Notices: 8</span>
            <span className="text-gray-400">|</span>
            <span className="text-orange-500">Draft Notice: 04</span>
          </div>
        </div>
 
      </div>

      <NoticeListUI />
    </div>
  );
}
