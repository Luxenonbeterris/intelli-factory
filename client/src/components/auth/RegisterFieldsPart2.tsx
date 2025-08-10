// client/src/components/auth/RegisterFieldsPart2.tsx
import type { Country, Region } from '../../hooks/useRegisterForm'

interface Props {
  t: (k: string, def?: string) => string
  location: string
  setLocation: (v: string) => void
  countryId: number | null
  setCountryId: (v: number | null) => void
  regionId: number | null
  setRegionId: (v: number | null) => void
  countries: Country[]
  regions: Region[]
  regionsLoading: boolean // <-- новое
}

export default function RegisterFieldsPart2({
  t,
  location,
  setLocation,
  countryId,
  setCountryId,
  regionId,
  setRegionId,
  countries,
  regions,
  regionsLoading, // <-- новое
}: Props) {
  const placeholder = regionsLoading
    ? t('register.loadingRegions', 'Loading regions…')
    : regions.length
      ? t('register.selectRegion')
      : t('register.noRegions', 'No regions')

  return (
    <>
      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.country')}
        <select
          value={countryId ?? ''}
          onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : null)}
          required
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        >
          <option value="">{t('register.selectCountry')}</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        <div className="flex items-center justify-between">
          <span>{t('register.region')}</span>
          {regionsLoading && (
            <span
              role="status"
              aria-live="polite"
              className="ml-2 inline-flex items-center text-xs text-gray-600"
            >
              <span className="mr-2">{t('register.loading', 'Loading')}</span>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            </span>
          )}
        </div>

        <select
          value={regionsLoading ? '' : (regionId ?? '')}
          onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : null)}
          disabled={regionsLoading || !regions.length} // блокируем на время загрузки и когда списка нет
          aria-busy={regionsLoading}
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        >
          <option value="">{placeholder}</option>
          {!regionsLoading &&
            regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
        </select>
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.location')}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('register.locationPlaceholder')}
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        />
      </label>
    </>
  )
}
