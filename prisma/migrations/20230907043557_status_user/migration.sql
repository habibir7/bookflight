/*
  Warnings:

  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT,
    "zip" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightSchedule" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "takeoff" TIMESTAMP(3) NOT NULL,
    "landing" TIMESTAMP(3) NOT NULL,
    "airportIdfrom" INTEGER NOT NULL,
    "airportIdto" INTEGER NOT NULL,
    "transit" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FlightSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightFacilities" (
    "id" SERIAL NOT NULL,
    "flightScheduleId" INTEGER NOT NULL,
    "listScheduleId" INTEGER NOT NULL,

    CONSTRAINT "FlightFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketFlight" (
    "id" SERIAL NOT NULL,
    "passengerId" INTEGER NOT NULL,
    "isRefundable" BOOLEAN NOT NULL,
    "iscanReschedule" BOOLEAN NOT NULL,
    "isWithInsurance" BOOLEAN NOT NULL,
    "totalPayment" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "TicketFlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassengerDetail" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "ticketFlightId" INTEGER NOT NULL,

    CONSTRAINT "PassengerDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketFlightStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TicketFlightStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airport" ADD CONSTRAINT "Airport_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSchedule" ADD CONSTRAINT "FlightSchedule_airportIdfrom_fkey" FOREIGN KEY ("airportIdfrom") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightSchedule" ADD CONSTRAINT "FlightSchedule_airportIdto_fkey" FOREIGN KEY ("airportIdto") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightFacilities" ADD CONSTRAINT "FlightFacilities_flightScheduleId_fkey" FOREIGN KEY ("flightScheduleId") REFERENCES "FlightSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightFacilities" ADD CONSTRAINT "FlightFacilities_listScheduleId_fkey" FOREIGN KEY ("listScheduleId") REFERENCES "Facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketFlight" ADD CONSTRAINT "TicketFlight_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketFlight" ADD CONSTRAINT "TicketFlight_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TicketFlightStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassengerDetail" ADD CONSTRAINT "PassengerDetail_ticketFlightId_fkey" FOREIGN KEY ("ticketFlightId") REFERENCES "TicketFlight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
