// prisma/seeds/userSeed.ts
import { faker } from '@faker-js/faker'
import { PrismaClient, Role, type Prisma, type User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'

const prisma = new PrismaClient()

const DEFAULT_CATEGORIES = ['Metal', 'Electronics', 'Textile', 'Essentials', 'Furniture'] as const
type CategoryItem = { id: number; name: string }

async function ensureCategories(): Promise<CategoryItem[]> {
  const categories = await prisma.$transaction(
    Array.from(DEFAULT_CATEGORIES).map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )
  return categories.map((c) => ({ id: c.id, name: c.name }))
}

function question(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input, output })
  return new Promise((resolve) => {
    rl.question(prompt, (ans) => {
      rl.close()
      resolve(ans.trim())
    })
  })
}

async function questionYesNo(promptText: string, defaultYes = true): Promise<boolean> {
  const def = defaultYes ? '[Y/n]' : '[y/N]'
  const ans = (await question(`${promptText} ${def}: `)).toLowerCase()
  if (ans === '') return defaultYes
  return ans.startsWith('y')
}

async function promptHidden(promptText: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return question(promptText)
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output, terminal: true })

    output.write(promptText)

    // Mask input: internal hack, disable lint for internal property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rlAny = rl as any
    const originalWrite = rlAny._writeToOutput.bind(rlAny)
    rlAny._writeToOutput = (str: string) => {
      if (rlAny.stdoutMuted) {
        output.write('*')
      } else {
        originalWrite(str)
      }
    }
    rlAny.stdoutMuted = true

    rl.question('', (answer) => {
      rlAny._writeToOutput = originalWrite
      output.write('\n')
      rl.close()
      resolve(answer)
    })
  })
}

function parseRole(inputStr: string): Role | null {
  const norm = inputStr.trim().toLowerCase()
  switch (norm) {
    case 'manager':
    case 'm':
      return Role.MANAGER
    case 'factory':
    case 'f':
      return Role.FACTORY
    case 'logist':
    case 'logistic':
    case 'l':
      return Role.LOGISTIC
    case 'customer':
    case 'c':
      return Role.CUSTOMER
    default:
      return null
  }
}

type CountryWithRegions = {
  id: number
  code: string
  name: string
  regions: { id: number; name: string }[]
}

async function loadCountriesAndRegions(): Promise<CountryWithRegions[]> {
  const countries = await prisma.country.findMany({
    include: {
      translations: true,
      regions: {
        include: {
          translations: true,
        },
      },
    },
    orderBy: { code: 'asc' },
  })

  return countries.map((c) => {
    const countryName = c.translations.find((t) => ['eng', 'en'].includes(t.lang))?.name ?? c.code

    const regions = c.regions.map((r) => {
      const regionName =
        r.translations.find((t) => t.lang === 'en')?.name ??
        Object.values(r.translations)[0]?.name ??
        ''
      return { id: r.id, name: regionName }
    })
    return {
      id: c.id,
      code: c.code,
      name: countryName,
      regions,
    }
  })
}

async function createUser(
  role: Role,
  passwordHash: string,
  country?: CountryWithRegions,
  region?: { id: number; name: string }
): Promise<User> {
  const locationParts: string[] = []
  if (region && region.name) locationParts.push(region.name)
  if (country && country.name) locationParts.push(country.name)
  if (locationParts.length === 0) locationParts.push(faker.location.city())

  const userData: Prisma.UserCreateInput = {
    email: faker.internet.email(),
    password: passwordHash,
    name: faker.person.fullName(),
    role,
    location: locationParts.join(', '),
    ...(country ? { countryId: country.id } : {}),
    ...(region ? { regionId: region.id } : {}),
    emailVerified: true,
  }

  return prisma.user.create({ data: userData })
}

function parseMultiSelect(input: string, max: number): number[] {
  return input
    .split(',')
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => !isNaN(i) && i >= 0 && i < max)
    .filter((v, i, a) => a.indexOf(v) === i)
}

async function main() {
  console.log('=== Interactive user seeding ===\n')

  const countriesCache = await loadCountriesAndRegions()
  if (countriesCache.length === 0) {
    console.error('No countries/regions found in DB. Seed countries and regions first.')
    process.exitCode = 1
    return
  }

  const categories = await ensureCategories()

  while (true) {
    let role: Role | null = null
    while (!role) {
      const r = await question('Which user to create? [manager, logist, factory, customer]: ')
      role = parseRole(r)
      if (!role) console.log('Invalid role, try again.')
    }

    const customPassword = await questionYesNo('Set password manually?', true)
    let rawPassword: string
    if (customPassword) {
      try {
        rawPassword = await promptHidden('Enter password: ')
      } catch {
        console.log('Aborted input, using default "123456"')
        rawPassword = '123456'
      }
      if (!rawPassword) {
        console.log('Empty input, using default "123456"')
        rawPassword = '123456'
      }
    } else {
      rawPassword = '123456'
      console.log('Password: 123456 (default)')
    }
    const passwordHash = await bcrypt.hash(rawPassword, 10)

    let count: number
    while (true) {
      const cntStr = await question('How many to create? ')
      count = parseInt(cntStr, 10)
      if (!isNaN(count) && count > 0) break
      console.log('Need an integer greater than zero.')
    }

    // Country / region selection
    console.log('\nAvailable countries:')
    countriesCache.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.code} — ${c.name}`)
    })
    console.log('  0. Skip country/region')
    const countrySelRaw = await question('Select country by number: ')
    const countryIdx = parseInt(countrySelRaw, 10) - 1
    let chosenCountry: CountryWithRegions | undefined
    let chosenRegion: { id: number; name: string } | undefined
    if (!isNaN(countryIdx) && countryIdx >= 0 && countryIdx < countriesCache.length) {
      chosenCountry = countriesCache[countryIdx]
      if (chosenCountry.regions.length > 0) {
        console.log(`\nRegions for ${chosenCountry.name}:`)
        chosenCountry.regions.forEach((r, i) => {
          console.log(`  ${i + 1}. ${r.name || '(no name)'}`)
        })
        console.log('  0. Skip region')
        const regionSelRaw = await question('Select region by number: ')
        const regionIdx = parseInt(regionSelRaw, 10) - 1
        if (!isNaN(regionIdx) && regionIdx >= 0 && regionIdx < chosenCountry.regions.length) {
          chosenRegion = chosenCountry.regions[regionIdx]
        }
      }
    }

    const created: User[] = []

    // If factory, ask once per batch about categories
    let factoryCategoryIds: number[] = []
    if (role === Role.FACTORY) {
      const assign = await questionYesNo('Assign categories to these factory users?', true)
      if (assign) {
        console.log('Available categories:')
        categories.forEach((c, i) => {
          console.log(`  ${i + 1}. ${c.name}`)
        })
        const sel = await question('Pick categories by number (comma separated, e.g. 1,3): ')
        const pickedIdx = parseMultiSelect(sel, categories.length)
        factoryCategoryIds = pickedIdx.map((i) => categories[i].id)
      }
    }

    for (let i = 0; i < count; i++) {
      try {
        const user = await createUser(role, passwordHash, chosenCountry, chosenRegion)
        created.push(user)
        console.log(`✅ ${user.email} (${role}) id=${user.id}`)

        if (role === Role.FACTORY && factoryCategoryIds.length > 0) {
          const payload = factoryCategoryIds.map((categoryId) => ({
            userId: user.id,
            categoryId,
          }))
          await prisma.categoryToUser.createMany({
            data: payload,
            skipDuplicates: true,
          })
          const linked = categories
            .filter((c) => factoryCategoryIds.includes(c.id))
            .map((c) => c.name)
            .join(', ')
          console.log(`   linked to categories: ${linked}`)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn('User creation error:', msg)
      }
    }

    console.log(`\nSummary: created ${created.length} user(s) with role ${role}.\n`)

    const cont = await questionYesNo('Continue creating more?', true)
    if (!cont) break
    console.log('-----------------------------\n')
  }

  console.log('Done. Exiting.')
}

main()
  .catch((e) => {
    console.error('Fatal error:', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
