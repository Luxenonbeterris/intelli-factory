export default function ThemeGuide() {
  return (
    <div className="space-y-16 bg-white p-10 font-sans text-gray-900">
      {/* Colors */}
      <section>
        <h2 className="text-2xl font-semibold">Colors</h2>
        <div className="flex flex-wrap gap-6 mt-4">
          <ColorSwatch name="Primary" className="bg-indigo-600" hex="#4f46e5" />
          <ColorSwatch name="Primary Hover" className="bg-indigo-500" hex="#6366f1" />
          <ColorSwatch name="Gray 900" className="bg-gray-900" hex="#111827" />
          <ColorSwatch name="Gray 600" className="bg-gray-600" hex="#4b5563" />
          <ColorSwatch name="Gray 500" className="bg-gray-500" hex="#6b7280" />
          <ColorSwatch name="Gray 50" className="bg-gray-50 border" hex="#f9fafb" />
          <ColorSwatch name="Gradient From" className="bg-[#ff80b5]" hex="#ff80b5" />
          <ColorSwatch name="Gradient To" className="bg-[#9089fc]" hex="#9089fc" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-semibold">Typography</h2>
        <div className="space-y-4 mt-4">
          <h1 className="text-5xl font-semibold tracking-tight">Heading 1 – 5xl</h1>
          <h2 className="text-3xl font-semibold">Heading 2 – 3xl</h2>
          <p className="text-lg font-medium text-gray-600">Body – lg / medium / gray-600</p>
          <p className="text-sm font-semibold text-gray-500">Caption – sm / semibold / gray-500</p>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex gap-4 mt-4">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            Primary
          </button>
          <button className="rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Subtle
          </button>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-semibold">Shadows</h2>
        <div className="flex gap-6 mt-4">
          <div className="rounded-md bg-white p-4 shadow-xs">shadow-xs</div>
          <div className="rounded-md bg-white p-4 shadow-sm">shadow-sm</div>
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h2 className="text-2xl font-semibold">Spacing Example (py-32)</h2>
        <div className="bg-gray-100 py-32 text-center text-gray-600">Huge Section Padding</div>
      </section>
    </div>
  )
}

function ColorSwatch({ name, className, hex }) {
  return (
    <div className="w-32 text-sm">
      <div className={`h-16 w-full rounded ${className}`} />
      <div className="mt-1 text-gray-700">{name}</div>
      <div className="text-xs text-gray-400">{hex}</div>
    </div>
  )
}
