// client/src/pages/roles/FactoryHome.tsx
export default function FactoryHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Factory Dashboard</h1>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600">
          Matching requests for your factory will appear here.
        </p>
        {/* TODO: filters by category/capacity; table of open requests */}
      </div>
    </div>
  )
}
