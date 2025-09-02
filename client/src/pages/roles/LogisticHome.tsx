// client/src/pages/roles/LogisticHome.tsx
export default function LogisticHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Logistics Dashboard</h1>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Routes and shipments compiled from customer + factory responses will show here.
        </p>
        {/* TODO: route planner, region filters, active tenders */}
      </div>
    </div>
  )
}
