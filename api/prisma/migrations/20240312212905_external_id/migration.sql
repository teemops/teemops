/*
  Warnings:

  - You are about to drop the column `externalId` on the `user_cloud_provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_cloud_provider` DROP COLUMN `externalId`;

-- AlterTable
ALTER TABLE `user_data_aws_configs` ADD COLUMN `externalId` VARCHAR(255) NULL;
