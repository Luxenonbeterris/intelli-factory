// prisma/seeds/seedCountriesAndRegions.ts
import { PrismaClient } from '@prisma/client'
import { stdin as input, stdout as output } from 'node:process'
import pLimit from 'p-limit'
import path from 'path'
import { createInterface } from 'readline'

import {
  CountryWithTranslations as FullCountryWithTranslations,
  loadAllCountryTranslations,
} from './utils-extended/country'
import { loadRegionTranslationsExtended } from './utils-extended/region'
import { CountryWithTranslations, loadCountryTranslations } from './utils/country'
import { loadRegionTranslations } from './utils/region'

const prisma = new PrismaClient()
const COUNTRIES_JSON = path.join('prisma', 'seeds', 'countries.json')
const REGION_LANGS = ['en', 'ru', 'zh'] as const
type Mode = 'short' | 'long'

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input, output })
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function chooseModeFromPrompt(): Promise<Mode> {
  const argMode = process.argv.find((a) => a.startsWith('--mode='))
  if (argMode) {
    const [, val] = argMode.split('=')
    if (val === 'short' || val === 'long') return val
  }
  if (!process.stdin.isTTY) return 'short'
  const answer = await prompt(
    'Choose load option: (s)hort — only RU,KZ,CN, (l)ong — all countries [s/l]: '
  )
  const normalized = answer.trim().toLowerCase()
  return normalized.startsWith('l') ? 'long' : 'short'
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, backoffMs = 200): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, backoffMs * (i + 1)))
      }
    }
  }
  throw lastErr
}

async function processCountry(
  countryData: CountryWithTranslations | FullCountryWithTranslations,
  mode: Mode,
  existingCodes: Set<string>
) {
  const { code, translations } = countryData
  if (existingCodes.has(code)) {
    console.log(`⚠️ Skipping already-seeded country ${code}`)
    return
  }

  let countryId: number
  try {
    const country = await withRetry(() =>
      prisma.country.create({
        data: {
          code,
          translations: {
            create: translations,
          },
        },
      })
    )
    countryId = country.id
    existingCodes.add(code)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`❌ Failed creating country ${code}:`, msg)
    return
  }

  let regionsRaw: { names: Record<string, string> }[] = []
  try {
    regionsRaw =
      mode === 'short'
        ? await loadRegionTranslations(code, Array.from(REGION_LANGS))
        : await loadRegionTranslationsExtended(code, Array.from(REGION_LANGS))
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn(`⚠️ Failed loading region translations for ${code}:`, msg)
    regionsRaw = []
  }

  const createdRegions: { id: number; names: Record<string, string> }[] = []

  for (const { names } of regionsRaw) {
    try {
      const region = await withRetry(() =>
        prisma.region.create({
          data: {
            country: { connect: { id: countryId } },
          },
        })
      )
      createdRegions.push({ id: region.id, names })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`⚠️ Failed creating region for country ${code}:`, msg)
    }
  }

  const regionTranslationsBulk: { regionId: number; lang: string; name: string }[] = []
  for (const { id: regionId, names } of createdRegions) {
    for (const lang of REGION_LANGS) {
      const name = names[lang]
      if (name) {
        regionTranslationsBulk.push({
          regionId,
          lang,
          name,
        })
      }
    }
  }

  if (regionTranslationsBulk.length > 0) {
    try {
      await withRetry(() =>
        prisma.regionTranslation.createMany({
          data: regionTranslationsBulk,
          skipDuplicates: true,
        })
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`❌ Failed creating region translations for country ${code}:`, msg)
    }
  }

  console.log(
    `🌐 Country created ${code} with ${translations.length} translations and ${createdRegions.length} regions.`
  )
  if (mode === 'short' || createdRegions.length <= 10) {
    for (const { names } of createdRegions) {
      const enName = names['en'] ?? '(no en name)'
      console.log(`✅ ${code} — ${enName}`)
    }
  } else {
    console.log(`✅ ${code} — first 10 region examples:`)
    createdRegions
      .slice(0, 10)
      .forEach(({ names }) => console.log(`   • ${names['en'] ?? '(no en name)'}`))
  }
}

async function main() {
  const mode = await chooseModeFromPrompt()
  console.log(`🚦 Mode: ${mode === 'short' ? 'short (RU,KZ,CN)' : 'full (all countries)'} `)

  console.log('🧹 Clearing the DB...')
  await prisma.$transaction([
    prisma.finalOffer.deleteMany(),
    prisma.compiledOffer.deleteMany(),
    prisma.logisticResponse.deleteMany(),
    prisma.factoryResponse.deleteMany(),
    prisma.customerRequest.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.categoryToUser.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.regionTranslation.deleteMany(),
    prisma.region.deleteMany(),
    prisma.countryTranslation.deleteMany(),
    prisma.country.deleteMany(),
  ])
  console.log('✅ DB is clear.')

  let countries: CountryWithTranslations[] | FullCountryWithTranslations[]
  countries =
    mode === 'short'
      ? await loadCountryTranslations(COUNTRIES_JSON, ['RU', 'KZ', 'CN'])
      : await loadAllCountryTranslations(COUNTRIES_JSON)

  const existing = await prisma.country.findMany({ select: { code: true } })
  const existingCodes = new Set(existing.map((c) => c.code))

  const countryLimit = pLimit(2)
  await Promise.all(
    countries.map((c) => countryLimit(() => processCountry(c, mode, existingCodes)))
  )
}

main()
  .catch((e) => {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('❌ Fatal error:', msg)
    throw e
  })
  .finally(() => prisma.$disconnect())
