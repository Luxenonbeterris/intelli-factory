import fs from 'fs/promises'

export type CountryTranslation = { lang: string; name: string }
export type CountryWithTranslations = { code: string; translations: CountryTranslation[] }

type RawCountry = {
  cca2: string
  name?: { common?: string }
  translations?: Record<string, { common?: string }>
}

export async function loadAllCountryTranslations(
  countriesJsonPath: string,
  targetCodes?: readonly string[]
): Promise<CountryWithTranslations[]> {
  const raw = await fs.readFile(countriesJsonPath, 'utf-8')
  const countries: RawCountry[] = JSON.parse(raw)

  return countries
    .filter((c) => (targetCodes ? targetCodes.includes(c.cca2) : true))
    .map((country) => {
      const code = country.cca2
      const translations: CountryTranslation[] = []

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
