import fs from 'fs/promises'
import path from 'path'

export type RegionTranslations = {
  regionCode: string
  names: Record<string, string>
}

const DEFAULT_REGION_LANGS = ['en', 'ru', 'zh'] as const

/**
 *
 * @param countryCode
 * @param regionLangs
 * @param basePath
 */
export async function loadRegionTranslations(
  countryCode: string,
  regionLangs: readonly string[] = Array.from(DEFAULT_REGION_LANGS),
  basePath = path.join('node_modules', 'iso3166-2-db')
): Promise<RegionTranslations[]> {
  const regionMap = new Map<string, Record<string, string>>()

  for (const lang of regionLangs) {
    const filePath = path.join(basePath, 'regions', countryCode, 'dispute', 'UN', `${lang}.json`)

    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      const json = JSON.parse(raw) as Record<string, { name: string }>

      for (const [regionCode, { name }] of Object.entries(json)) {
        if (!regionMap.has(regionCode)) regionMap.set(regionCode, {})
        regionMap.get(regionCode)![lang] = name
      }
    } catch (e) {
      if (e instanceof Error) {
        console.warn(`⚠️ ...`, e.message)
      } else {
        console.warn(`⚠️ ...`, String(e))
      }
    }
  }

  return Array.from(regionMap.entries())
    .filter(([, names]) => Boolean(names['en']))
    .map(([regionCode, names]) => ({ regionCode, names }))
}
