import fs from 'fs/promises'
import path from 'path'

export type RegionTranslations = {
  regionCode: string
  names: Record<string, string>
}

const DEFAULT_REGION_LANGS = ['en', 'ru', 'zh'] as const

export async function listAllCountryCodes(
  basePath = path.join('node_modules', 'iso3166-2-db', 'regions')
): Promise<string[]> {
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory() && /^[A-Z]{2,3}$/.test(e.name)).map((e) => e.name)
}

export async function loadRegionTranslationsExtended(
  countryCode: string,
  regionLangs: readonly string[] = Array.from(DEFAULT_REGION_LANGS),
  basePath = path.join('node_modules', 'iso3166-2-db', 'regions')
): Promise<RegionTranslations[]> {
  const regionMap = new Map<string, Record<string, string>>()

  const tryPaths = (lang: string) => [
    path.join(basePath, countryCode, 'dispute', 'UN', `${lang}.json`),
    path.join(basePath, countryCode, 'UN', `${lang}.json`),
    path.join(basePath, countryCode, `${lang}.json`),
  ]

  for (const lang of regionLangs) {
    let loaded = false
    for (const p of tryPaths(lang)) {
      try {
        const raw = await fs.readFile(p, 'utf-8')
        const json = JSON.parse(raw) as Record<string, { name: string }>

        for (const [regionCode, { name }] of Object.entries(json)) {
          if (!regionMap.has(regionCode)) regionMap.set(regionCode, {})
          regionMap.get(regionCode)![lang] = name
        }
        loaded = true
        break
      } catch {
        console.debug(`Skipped missing path: ${p}`)
      }
    }
    if (!loaded) {
      console.warn(`⚠️ No translation source found for country=${countryCode} lang=${lang}`)
    }
  }

  return Array.from(regionMap.entries())
    .filter(([, names]) => Boolean(names['en']))
    .map(([regionCode, names]) => ({ regionCode, names }))
}
