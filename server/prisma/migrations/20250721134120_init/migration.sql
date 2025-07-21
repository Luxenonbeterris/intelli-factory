-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'FACTORY', 'LOGISTIC', 'MANAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role",
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRequest" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "location" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactoryResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "factoryResponseId" INTEGER NOT NULL,
    "etaDays" INTEGER NOT NULL,
    "deliveryCost" DOUBLE PRECISION NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogisticResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompiledOffer" (
    "id" SERIAL NOT NULL,
    "factoryResponseId" INTEGER NOT NULL,
    "logisticResponseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompiledOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalOffer" (
    "id" SERIAL NOT NULL,
    "compiledOfferId" INTEGER NOT NULL,
    "finalEtaDays" INTEGER NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "margin" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL,
    "finalNote" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryToUser" (
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CategoryToUser_pkey" PRIMARY KEY ("categoryId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CustomerRequest_customerId_idx" ON "CustomerRequest"("customerId");

-- CreateIndex
CREATE INDEX "CustomerRequest_categoryId_idx" ON "CustomerRequest"("categoryId");

-- CreateIndex
CREATE INDEX "FactoryResponse_requestId_idx" ON "FactoryResponse"("requestId");

-- CreateIndex
CREATE INDEX "LogisticResponse_factoryResponseId_idx" ON "LogisticResponse"("factoryResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "CompiledOffer_factoryResponseId_logisticResponseId_key" ON "CompiledOffer"("factoryResponseId", "logisticResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalOffer_compiledOfferId_key" ON "FinalOffer"("compiledOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- AddForeignKey
ALTER TABLE "CustomerRequest" ADD CONSTRAINT "CustomerRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRequest" ADD CONSTRAINT "CustomerRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryResponse" ADD CONSTRAINT "FactoryResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryResponse" ADD CONSTRAINT "FactoryResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CustomerRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticResponse" ADD CONSTRAINT "LogisticResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticResponse" ADD CONSTRAINT "LogisticResponse_factoryResponseId_fkey" FOREIGN KEY ("factoryResponseId") REFERENCES "FactoryResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompiledOffer" ADD CONSTRAINT "CompiledOffer_factoryResponseId_fkey" FOREIGN KEY ("factoryResponseId") REFERENCES "FactoryResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompiledOffer" ADD CONSTRAINT "CompiledOffer_logisticResponseId_fkey" FOREIGN KEY ("logisticResponseId") REFERENCES "LogisticResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalOffer" ADD CONSTRAINT "FinalOffer_compiledOfferId_fkey" FOREIGN KEY ("compiledOfferId") REFERENCES "CompiledOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToUser" ADD CONSTRAINT "CategoryToUser_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryToUser" ADD CONSTRAINT "CategoryToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
