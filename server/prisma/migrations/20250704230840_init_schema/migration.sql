-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'FACTORY', 'LOGISTIC', 'MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PositionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOffer" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "estimatedTimeDays" INTEGER NOT NULL,
    "factoryId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "FactoryOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsRequest" (
    "id" TEXT NOT NULL,
    "factoryOfferId" TEXT NOT NULL,

    CONSTRAINT "LogisticsRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticOffer" (
    "id" TEXT NOT NULL,
    "etaDays" INTEGER NOT NULL,
    "deliveryCost" DOUBLE PRECISION NOT NULL,
    "logisticsRequestId" TEXT NOT NULL,
    "logisticId" TEXT NOT NULL,

    CONSTRAINT "LogisticOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompiledOffer" (
    "id" TEXT NOT NULL,
    "factoryOfferId" TEXT NOT NULL,
    "logisticOfferId" TEXT NOT NULL,

    CONSTRAINT "CompiledOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalOffer" (
    "id" TEXT NOT NULL,
    "compiledOfferId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactoryCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FactoryCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PositionCategory_name_key" ON "PositionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_userId_key" ON "Factory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompiledOffer_logisticOfferId_key" ON "CompiledOffer"("logisticOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalOffer_compiledOfferId_key" ON "FinalOffer"("compiledOfferId");

-- CreateIndex
CREATE INDEX "_FactoryCategories_B_index" ON "_FactoryCategories"("B");

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRequest" ADD CONSTRAINT "CustomerRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PositionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRequest" ADD CONSTRAINT "CustomerRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOffer" ADD CONSTRAINT "FactoryOffer_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOffer" ADD CONSTRAINT "FactoryOffer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CustomerRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOffer" ADD CONSTRAINT "FactoryOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsRequest" ADD CONSTRAINT "LogisticsRequest_factoryOfferId_fkey" FOREIGN KEY ("factoryOfferId") REFERENCES "FactoryOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticOffer" ADD CONSTRAINT "LogisticOffer_logisticsRequestId_fkey" FOREIGN KEY ("logisticsRequestId") REFERENCES "LogisticsRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticOffer" ADD CONSTRAINT "LogisticOffer_logisticId_fkey" FOREIGN KEY ("logisticId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompiledOffer" ADD CONSTRAINT "CompiledOffer_factoryOfferId_fkey" FOREIGN KEY ("factoryOfferId") REFERENCES "FactoryOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompiledOffer" ADD CONSTRAINT "CompiledOffer_logisticOfferId_fkey" FOREIGN KEY ("logisticOfferId") REFERENCES "LogisticOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOffer" ADD CONSTRAINT "FinalOffer_compiledOfferId_fkey" FOREIGN KEY ("compiledOfferId") REFERENCES "CompiledOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoryCategories" ADD CONSTRAINT "_FactoryCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactoryCategories" ADD CONSTRAINT "_FactoryCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "PositionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
