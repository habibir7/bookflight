-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_regencyId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "regencyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
