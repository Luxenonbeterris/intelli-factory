import type { CustomerRequest } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // clear
  await prisma.finalOffer.deleteMany()
  await prisma.compiledOffer.deleteMany()
  await prisma.logisticOffer.deleteMany()
  await prisma.logisticsRequest.deleteMany()
  await prisma.factoryOffer.deleteMany()
  await prisma.customerRequest.deleteMany()
  await prisma.factory.deleteMany()
  await prisma.positionCategory.deleteMany()
  await prisma.user.deleteMany()

  // seed users
  const passwordHash = await bcrypt.hash('test1234', 10)
  const customers = await Promise.all(
    [...Array(10)].map((_, i) =>
      prisma.user.create({
        data: {
          email: `customer${i}@test.com`,
          password: passwordHash,
          role: 'CUSTOMER',
          name: `Customer ${i}`,
        },
      })
    )
  )
  const factories = await Promise.all(
    [...Array(5)].map((_, i) =>
      prisma.user.create({
        data: {
          email: `factory${i}@test.com`,
          password: passwordHash,
          role: 'FACTORY',
          name: `Factory Owner ${i}`,
        },
      })
    )
  )
  const logistics = await Promise.all(
    [...Array(3)].map((_, i) =>
      prisma.user.create({
        data: {
          email: `logistic${i}@test.com`,
          password: passwordHash,
          role: 'LOGISTIC',
          name: `Logistic ${i}`,
        },
      })
    )
  )
  await Promise.all(
    [...Array(2)].map((_, i) =>
      prisma.user.create({
        data: {
          email: `manager${i}@test.com`,
          password: passwordHash,
          role: 'MANAGER',
          name: `Manager ${i}`,
        },
      })
    )
  )

  // seed categories
  const categories = await Promise.all(
    ['Металлы', 'Электроника', 'Текстиль', 'Стройматериалы', 'Пищевое оборудование'].map((name) =>
      prisma.positionCategory.create({ data: { name } })
    )
  )

  // factories with categories
  const factoryEntities = await Promise.all(
    factories.map((factory, i) =>
      prisma.factory.create({
        data: {
          name: `Factory ${i}`,
          userId: factory.id,
          categories: {
            connect: categories.filter((_, idx) => idx % (i + 2) === 0).map((c) => ({ id: c.id })),
          },
        },
      })
    )
  )

  // customer requests
  const requests: CustomerRequest[] = []
  for (const customer of customers) {
    const requestCount = Math.floor(Math.random() * 2) + 2
    for (let j = 0; j < requestCount; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      requests.push(
        await prisma.customerRequest.create({
          data: {
            description: `Need ${category.name} - qty ${10 + j}`,
            quantity: 10 + j,
            categoryId: category.id,
            customerId: customer.id,
          },
        })
      )
    }
  }

  // factory offers + logistics + compiled + final
  for (const req of requests) {
    const selectedFactories = factoryEntities.slice(0, 2 + Math.floor(Math.random() * 2))
    for (const f of selectedFactories) {
      const factoryOffer = await prisma.factoryOffer.create({
        data: {
          price: 1000 + Math.random() * 500,
          estimatedTimeDays: 5 + Math.floor(Math.random() * 10),
          factoryId: f.id,
          requestId: req.id,
        },
      })

      const logisticsRequest = await prisma.logisticsRequest.create({
        data: { factoryOfferId: factoryOffer.id },
      })

      const logisticOffer = await prisma.logisticOffer.create({
        data: {
          etaDays: 2 + Math.floor(Math.random() * 5),
          deliveryCost: 200 + Math.random() * 100,
          logisticsRequestId: logisticsRequest.id,
          logisticId: logistics[Math.floor(Math.random() * logistics.length)].id,
        },
      })

      const compiled = await prisma.compiledOffer.create({
        data: {
          factoryOfferId: factoryOffer.id,
          logisticOfferId: logisticOffer.id,
        },
      })

      if (Math.random() < 0.5) {
        await prisma.finalOffer.create({
          data: {
            compiledOfferId: compiled.id,
          },
        })
      }
    }
  }

  console.log('✅ Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    throw new Error('Seed failed')
  })
  .finally(() => prisma.$disconnect())
