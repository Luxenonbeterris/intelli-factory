// client/src/pages/roles/ManagerHome.tsx
export default function ManagerHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Manager Dashboard</h1>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Overview across customers, factories, and logistics.
        </p>
        {/* TODO: KPIs, audit highlights, moderation queue */}
      </div>
    </div>
  )
}
