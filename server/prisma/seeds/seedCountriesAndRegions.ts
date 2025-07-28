import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

const TARGET_CODES = ['RU', 'KZ', 'CN'] as const
const REGION_LANGS = ['en', 'ru', 'zh'] as const

type RawCountry = {
  cca2: string
  name?: { common?: string }
  translations?: Record<string, { common?: string }>
}

type RegionTranslations = {
  regionCode: string
  names: Record<string, string>
}

async function getCountryTranslations(): Promise<
  { code: string; translations: { lang: string; name: string }[] }[]
> {
  const raw = await fs.readFile('prisma/seeds/countries.json', 'utf-8')
  const countries: RawCountry[] = JSON.parse(raw)

  return countries
    .filter((c) => TARGET_CODES.includes(c.cca2 as (typeof TARGET_CODES)[number]))
    .map((country) => {
      const code = country.cca2
      const translations: { lang: string; name: string }[] = []

      if (typeof country.name?.common === 'string') {
        translations.push({ lang: 'eng', name: country.name.common })
      }

      for (const lang of ['rus', 'zho'] as const) {
        const trans = country.translations?.[lang]
        if (typeof trans?.common === 'string') {
          translations.push({ lang, name: trans.common })
        }
      }

      return { code, translations }
    })
}

async function getRegionTranslations(countryCode: string): Promise<RegionTranslations[]> {
  const regionMap = new Map<string, Record<string, string>>()

  for (const lang of REGION_LANGS) {
    const filePath = path.join(
      'node_modules',
      'iso3166-2-db',
      'regions',
      countryCode,
      'dispute',
      'UN',
      `${lang}.json`
    )

    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      const json = JSON.parse(raw) as Record<string, { name: string }>

      for (const [regionCode, { name }] of Object.entries(json)) {
        if (!regionMap.has(regionCode)) regionMap.set(regionCode, {})
        regionMap.get(regionCode)![lang] = name
      }
    } catch {
      console.warn(`⚠️  Missing region file for ${countryCode} [${lang}]`)
    }
  }

  return Array.from(regionMap.entries())
    .filter(([, names]) => names['en'])
    .map(([regionCode, names]) => ({ regionCode, names }))
}

async function main() {
  console.log('🧨 Wiping previous countries, regions and translations...')
  await prisma.regionTranslation.deleteMany({})
  await prisma.region.deleteMany({})
  await prisma.countryTranslation.deleteMany({})
  await prisma.country.deleteMany({})
  console.log('✅ Wiped clean.')

  const countries = await getCountryTranslations()

  for (const { code, translations } of countries) {
    const country = await prisma.country.create({
      data: {
        code,
        translations: {
          create: translations,
        },
      },
    })
    console.log(`🌐 Created country ${code} with ${translations.length} translations.`)

    const regions = await getRegionTranslations(code)

    for (const { names } of regions) {
      await prisma.region.create({
        data: {
          country: { connect: { id: country.id } },
          translations: {
            create: REGION_LANGS.filter((lang) => names[lang]).map((lang) => ({
              lang,
              name: names[lang],
            })),
          },
        },
      })

      console.log(`✅ ${code} — ${names['en']}`)
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    throw e
  })
  .finally(() => prisma.$disconnect())
