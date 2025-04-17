/*
  Warnings:

  - You are about to drop the column `externalId` on the `user_data_aws_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_data_aws_configs` DROP COLUMN `externalId`;

-- AlterTable
ALTER TABLE `user_data_providers` ADD COLUMN `externalId` VARCHAR(255) NULL;
