import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.finalOffer.deleteMany()
  await prisma.compiledOffer.deleteMany()
  await prisma.logisticResponse.deleteMany()
  await prisma.factoryResponse.deleteMany()
  await prisma.customerRequest.deleteMany()
  await prisma.category.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('14505', 10)

  const customers = await Promise.all(
    [...Array(10)].map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: passwordHash,
          name: faker.person.fullName(),
          role: 'CUSTOMER',
          location: `${faker.location.city()} ${faker.location.streetAddress()}`,
        },
      })
    )
  )

  const factories = await Promise.all(
    [...Array(10)].map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: passwordHash,
          name: faker.person.fullName(),
          role: 'FACTORY',
          location: `${faker.location.city()} ${faker.location.streetAddress()}`,
        },
      })
    )
  )

  const logists = await Promise.all(
    [...Array(10)].map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: passwordHash,
          name: faker.person.fullName(),
          role: 'LOGISTIC',
          location: `${faker.location.city()} ${faker.location.streetAddress()}`,
        },
      })
    )
  )

  const managers = await Promise.all(
    [...Array(2)].map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: passwordHash,
          name: faker.person.fullName(),
          role: 'MANAGER',
          location: `${faker.location.city()} ${faker.location.streetAddress()}`,
        },
      })
    )
  )

  const categoryNames = ['Metal', 'Electronincs', 'Textile', 'Essentials', 'Furniture']
  await Promise.all(categoryNames.map((name) => prisma.category.create({ data: { name } })))

  const allUsers = [...customers, ...factories, ...logists, ...managers]
  for (const user of allUsers) {
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        type: 'INFO',
        message: `${user.role} ${user.name} entered system`,
      },
    })
  }

  const allCategories = await prisma.category.findMany()

  for (const customer of customers) {
    const requestCount = faker.number.int({ min: 1, max: 3 })

    for (let i = 0; i < requestCount; i++) {
      const category = faker.helpers.arrayElement(allCategories)

      const request = await prisma.customerRequest.create({
        data: {
          customerId: customer.id,
          itemName: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(['kg', 'pcs', 'liters', 'meters']),
          quantity: faker.number.float({ min: 10, max: 500 }),
          categoryId: category.id,
          description: faker.commerce.productDescription(),
          location: customer.location,
        },
      })

      const respondingFactories = faker.helpers.arrayElements(factories, 2)

      for (const factory of respondingFactories) {
        const factoryResponse = await prisma.factoryResponse.create({
          data: {
            userId: factory.id,
            requestId: request.id,
            price: faker.number.float({ min: 100, max: 2000 }),
            currency: 'USD',
            estimatedDays: faker.number.int({ min: 3, max: 10 }),
            location: factory.location,
          },
        })

        const logist = faker.helpers.arrayElement(logists)
        const logisticResponse = await prisma.logisticResponse.create({
          data: {
            userId: logist.id,
            factoryResponseId: factoryResponse.id,
            etaDays: faker.number.int({ min: 1, max: 5 }),
            deliveryCost: faker.number.float({ min: 50, max: 500 }),
          },
        })

        const compiled = await prisma.compiledOffer.create({
          data: {
            factoryResponseId: factoryResponse.id,
            logisticResponseId: logisticResponse.id,
          },
        })

        if (Math.random() < 0.7) {
          await prisma.finalOffer.create({
            data: {
              compiledOfferId: compiled.id,
              finalEtaDays: factoryResponse.estimatedDays + logisticResponse.etaDays,
              finalPrice: factoryResponse.price + logisticResponse.deliveryCost,
              currency: 'USD',
              confirmed: faker.datatype.boolean(),
            },
          })
        }
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
