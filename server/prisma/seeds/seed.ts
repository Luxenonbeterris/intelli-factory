import { faker } from '@faker-js/faker'
import { PrismaClient, Role } from '@prisma/client'
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

  const createUsers = async (count: number, role: Role) =>
    Promise.all(
      Array.from({ length: count }, () =>
        prisma.user.create({
          data: {
            email: faker.internet.email(),
            password: passwordHash,
            name: faker.person.fullName(),
            role,
            location: `${faker.location.city()} ${faker.location.streetAddress()}`,
          },
        })
      )
    )

  const customers = await createUsers(10, 'CUSTOMER')
  const factories = await createUsers(10, 'FACTORY')
  const logists = await createUsers(10, 'LOGISTIC')
  const managers = await createUsers(2, 'MANAGER')

  const categoryNames = ['Metal', 'Electronics', 'Textile', 'Essentials', 'Furniture']
  const allCategories = await Promise.all(
    categoryNames.map((name) => prisma.category.create({ data: { name } }))
  )

  for (const factory of factories) {
    const specialties = faker.helpers.arrayElements(allCategories, 2)
    for (const category of specialties) {
      await prisma.categoryToUser.create({
        data: { categoryId: category.id, userId: factory.id },
      })
    }
  }

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

        await prisma.auditLog.create({
          data: {
            userId: factory.id,
            type: 'FACTORY_RESPONDED',
            message: `Factory ${factory.name} responded to request ${request.id}`,
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

        await prisma.auditLog.create({
          data: {
            userId: logist.id,
            type: 'LOGISTIC_RESPONDED',
            message: `Logist ${logist.name} responded to factoryResponse ${factoryResponse.id}`,
          },
        })

        const compiled = await prisma.compiledOffer.create({
          data: {
            factoryResponseId: factoryResponse.id,
            logisticResponseId: logisticResponse.id,
          },
        })

        await prisma.auditLog.create({
          data: {
            userId: customer.id,
            type: 'OFFER_COMPILED',
            message: `Compiled offer for request ${request.id} by factory ${factory.id} and logist ${logist.id}`,
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
