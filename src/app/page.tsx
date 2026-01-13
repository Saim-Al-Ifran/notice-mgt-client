// app/page.tsx
export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Active Notices</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Draft Notices</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">4</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Employees</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">120</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Departments</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">6</p>
        </div>
      </div>

      {/* Recent Notices Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Notices</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-3">
            <p className="font-medium">Office closed on Friday for maintenance</p>
            <p className="text-sm text-gray-500">Published on 15-Jun-2025</p>
          </li>
          <li className="py-3">
            <p className="font-medium">Eid al-Fitr holiday schedule</p>
            <p className="text-sm text-gray-500">Published on 15-Jun-2025</p>
          </li>
          <li className="py-3">
            <p className="font-medium">Updated code of conduct policy</p>
            <p className="text-sm text-gray-500">Published on 15-Jun-2025</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
