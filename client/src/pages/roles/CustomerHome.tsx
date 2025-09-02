// client/src/pages/roles/CustomerHome.tsx
import DefaultLayout from '../../layouts/Layout'

type RequestPreview = {
  id: number
  itemName: string
  unit: string
  quantity: number | string
  status: string
}

export default function CustomerHome() {
  const items: RequestPreview[] = [] // replace with real data later

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Customer Dashboard</h1>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">Your recent requests will appear here.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={r.id} className="rounded-md border p-3">
                  <div className="font-medium">{r.itemName}</div>
                  <div className="text-xs text-gray-600">
                    Qty {r.quantity} {r.unit} • {r.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
