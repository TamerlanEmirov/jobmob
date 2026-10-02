-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
