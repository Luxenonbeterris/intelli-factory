// server/src/controllers/location.controller.ts
import { Request, Response } from 'express'
import prisma from '../prisma'

const DEFAULT_LANG_COUNTRY = 'eng'
const DEFAULT_LANG_REGION = 'en'

const countryLangMap: Record<string, string> = {
  en: 'eng',
  ru: 'rus',
  zh: 'zho',
}

const regionLangMap: Record<string, string> = {
  en: 'en',
  ru: 'ru',
  zh: 'zh',
}

function mapCountryLang(lang: string) {
  return countryLangMap[lang.toLowerCase()] || lang.toLowerCase()
}

function mapRegionLang(lang: string) {
  return regionLangMap[lang.toLowerCase()] || lang.toLowerCase()
}

export async function getCountries(req: Request, res: Response): Promise<void> {
  const lang = mapCountryLang((req.query.lang as string) || 'en')
  const defaultLang = DEFAULT_LANG_COUNTRY

  try {
    const countries = await prisma.country.findMany({
      include: { translations: true },
    })

    const result = countries.map((c) => {
      const translation =
        c.translations.find((t) => t.lang.toLowerCase() === lang) ||
        c.translations.find((t) => t.lang.toLowerCase() === defaultLang)
      return { id: c.id, name: translation?.name || 'Unknown' }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getRegions(req: Request, res: Response): Promise<void> {
  const countryId = Number(req.query.countryId)
  const lang = mapRegionLang((req.query.lang as string) || 'en')
  const defaultLang = DEFAULT_LANG_REGION

  if (!countryId) {
    res.status(400).json({ error: 'countryId required' })
    return
  }

  try {
    const regions = await prisma.region.findMany({
      where: { countryId },
      include: { translations: true },
    })

    const result = regions.map((r) => {
      const translation =
        r.translations.find((t) => t.lang.toLowerCase() === lang) ||
        r.translations.find((t) => t.lang.toLowerCase() === defaultLang)
      return { id: r.id, name: translation?.name || 'Unknown' }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
