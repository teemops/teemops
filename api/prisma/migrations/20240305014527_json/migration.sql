/*
  Warnings:

  - The `meta` column on the `pricing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `pricing` DROP COLUMN `meta`,
    ADD COLUMN `meta` JSON NULL;
