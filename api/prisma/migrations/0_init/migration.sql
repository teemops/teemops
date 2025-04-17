-- CreateTable
CREATE TABLE `allowed_instance_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `order` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 6,
    `cloud` INTEGER NULL,
    `data` BLOB NULL,
    `appurl` VARCHAR(255) NULL,
    `timestamp` DATETIME(0) NULL,
    `app_provider_id` INTEGER NOT NULL,
    `user_data_provider_id` INTEGER NULL,
    `aws_config_data_id` INTEGER NULL,
    `user_cloud_provider_id` INTEGER NULL,
    `meta_data` BLOB NULL,
    `notify` TEXT NULL,
    `archive` TINYINT NULL,
    `isasg` TINYINT NULL,
    `isalb` TINYINT NULL,
    `asg_min` INTEGER NULL,
    `asg_max` INTEGER NULL,
    `platform` INTEGER NULL,
    `environment` INTEGER NULL,

    INDEX `FK_app_environment_idx`(`environment`),
    INDEX `FK_app_provider_id_idx`(`app_provider_id`),
    INDEX `FK_app_user_id_idx`(`userid`),
    INDEX `FK_aws_config_data_id_idx`(`aws_config_data_id`),
    INDEX `FK_user_data_provider_id_idx`(`user_data_provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_alb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appid` INTEGER NOT NULL,
    `subnets` VARCHAR(255) NULL,
    `listeners` VARCHAR(45) NULL,
    `sslArn` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_code` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `appid` VARCHAR(45) NULL,
    `path` VARCHAR(1000) NULL,
    `source` VARCHAR(1000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_integrations` (
    `id` INTEGER NOT NULL,
    `appid` BIGINT NOT NULL,
    `integrationid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `system` VARCHAR(255) NULL,
    `docker` VARCHAR(255) NULL,
    `os` VARCHAR(255) NULL,
    `description` TEXT NOT NULL,
    `logo` VARCHAR(255) NULL,
    `type` VARCHAR(45) NOT NULL,
    `enabled` VARCHAR(45) NULL,
    `aws_account_id` VARCHAR(30) NULL,
    `aws_ami_name` TEXT NULL,
    `connect_user` VARCHAR(45) NOT NULL,
    `connect_type` VARCHAR(45) NOT NULL,
    `parentid` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_provider_image_list` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `image_id` VARCHAR(255) NOT NULL,
    `cloud_provider_id` INTEGER NOT NULL,
    `region` VARCHAR(255) NOT NULL,
    `is_custom` TINYINT NOT NULL DEFAULT 0,
    `app_provider_id` INTEGER NOT NULL,
    `timestamp` BIGINT NOT NULL,

    INDEX `FK_app_provider_id_idx`(`app_provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_type` (
    `id` INTEGER NOT NULL,
    `type` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aws_account` VARCHAR(20) NULL,
    `role_arn` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_findings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `guid` VARCHAR(255) NOT NULL,
    `userid` BIGINT NULL,
    `results_id` BIGINT NOT NULL,
    `scan_id` BIGINT NOT NULL,
    `service` VARCHAR(45) NOT NULL,
    `resource` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `passed` TINYINT NOT NULL,
    `severity` VARCHAR(45) NOT NULL,
    `ruleset` VARCHAR(45) NOT NULL,
    `rule` VARCHAR(45) NOT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `region` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_results` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `scan_id` INTEGER NOT NULL,
    `region` VARCHAR(45) NULL,
    `service` VARCHAR(200) NOT NULL,
    `task` VARCHAR(200) NOT NULL,
    `item` VARCHAR(200) NOT NULL,
    `result` JSON NOT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_scan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_cloud_provider_id` INTEGER NOT NULL,
    `audit_type` INTEGER NOT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cloud_provider` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_task` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `job_type_id` BIGINT NOT NULL,
    `name` VARCHAR(45) NULL,
    `script` TEXT NULL,
    `params` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_type` (
    `id` INTEGER NOT NULL,
    `action` VARCHAR(45) NOT NULL,
    `queue` VARCHAR(45) NOT NULL,
    `description` VARCHAR(45) NOT NULL,
    `command` TEXT NOT NULL,
    `newstatus` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data` TEXT NOT NULL,
    `userid` BIGINT NOT NULL,
    `status` INTEGER NOT NULL,
    `appid` BIGINT NOT NULL,
    `jobtype` INTEGER NOT NULL,
    `job_task_id` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lookup_audit_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lookup_environment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `description` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `org` (
    `id` BIGINT NOT NULL DEFAULT 0,
    `name` VARCHAR(45) NOT NULL,
    `parentid` BIGINT NOT NULL,
    `owner` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricing` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cloudid` INTEGER NOT NULL,
    `vm_size` VARCHAR(45) NULL,
    `vm_price_per_hour` DECIMAL(18, 9) NULL,
    `region` VARCHAR(255) NULL,
    `usage_type` VARCHAR(255) NULL,
    `memory` VARCHAR(100) NULL,
    `vcpu` INTEGER NULL,
    `sku` VARCHAR(255) NOT NULL,
    `timestamp` DATETIME(0) NULL,
    `os` VARCHAR(100) NULL,
    `meta` BLOB NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region_map` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pricing_term` VARCHAR(200) NOT NULL,
    `value` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(45) NOT NULL,
    `status` INTEGER NOT NULL,
    `timestamp` BIGINT NOT NULL,
    `confirmcode` VARCHAR(255) NULL,
    `lastloggedin` VARCHAR(45) NULL,
    `first` VARCHAR(45) NULL,
    `last` VARCHAR(45) NULL,
    `temp_code` INTEGER NULL,
    `temp_code_expiry` BIGINT NULL,
    `uniqueid` VARCHAR(255) NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `username_UNIQUE`(`username`),
    UNIQUE INDEX `confirmcode_UNIQUE`(`confirmcode`),
    UNIQUE INDEX `uniqueid_UNIQUE`(`uniqueid`),
    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_cloud_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `cloud_provider_id` INTEGER NOT NULL,
    `aws_account_id` VARCHAR(45) NULL,
    `isDefault` TINYINT NULL,
    `name` VARCHAR(255) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `externalId` VARCHAR(255) NULL,

    INDEX `FK_cloud_provider_id_idx`(`cloud_provider_id`),
    INDEX `userid_idx`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_data_aws_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `userid` INTEGER NOT NULL,
    `vpc` VARCHAR(45) NOT NULL,
    `app_subnet` VARCHAR(1000) NOT NULL,
    `db_subnet` VARCHAR(1000) NULL,
    `elb_sg` VARCHAR(1000) NULL,
    `app_sg` VARCHAR(1000) NOT NULL,
    `db_sg` VARCHAR(1000) NULL,
    `app_instance_type` VARCHAR(45) NULL,
    `db_instance_type` VARCHAR(45) NULL,
    `cache_instance_type` VARCHAR(45) NULL,
    `custom_data` BLOB NULL,
    `region` VARCHAR(45) NOT NULL,
    `user_cloud_provider_id` BIGINT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,

    INDEX `FK_user_aws_config_user_id_idx`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_data_providers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_cloud_provider_id` INTEGER NOT NULL,
    `aws_auth_method` VARCHAR(45) NULL,
    `auth_data` TEXT NULL,
    `access_type` VARCHAR(45) NULL,

    INDEX `FK_user_cloud_provider_id_idx`(`user_cloud_provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_integrations` (
    `id` BIGINT NOT NULL,
    `userid` BIGINT NOT NULL,
    `integrationid` INTEGER NOT NULL,
    `credentials` TEXT NOT NULL,
    `date_added` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_org` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` BIGINT NOT NULL,
    `orgid` BIGINT NOT NULL,
    `permissions` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sub` (
    `subid` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `stripe_sub_id` VARCHAR(255) NOT NULL,
    `stripe_customer_id` VARCHAR(255) NOT NULL,
    `stripe_session_id` VARCHAR(255) NOT NULL,
    `sub_status` TINYINT NOT NULL DEFAULT 0,
    `timestamp` BIGINT NOT NULL,

    PRIMARY KEY (`subid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `app` ADD CONSTRAINT `FK_app_environment` FOREIGN KEY (`environment`) REFERENCES `lookup_environment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app` ADD CONSTRAINT `FK_app_provider_id` FOREIGN KEY (`app_provider_id`) REFERENCES `app_provider`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app` ADD CONSTRAINT `FK_app_user_id` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app` ADD CONSTRAINT `FK_aws_config_data_id` FOREIGN KEY (`aws_config_data_id`) REFERENCES `user_data_aws_configs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app` ADD CONSTRAINT `FK_user_data_provider_id` FOREIGN KEY (`user_data_provider_id`) REFERENCES `user_data_providers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `app_provider_image_list` ADD CONSTRAINT `FK_app_provider_image_list_id` FOREIGN KEY (`app_provider_id`) REFERENCES `app_provider`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_cloud_provider` ADD CONSTRAINT `FK_cloud_provider_id` FOREIGN KEY (`cloud_provider_id`) REFERENCES `cloud_provider`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_cloud_provider` ADD CONSTRAINT `FK_userid` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_data_aws_configs` ADD CONSTRAINT `FK_user_aws_config_user_id` FOREIGN KEY (`userid`) REFERENCES `user`(`userid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_data_providers` ADD CONSTRAINT `FK_user_cloud_provider_id` FOREIGN KEY (`user_cloud_provider_id`) REFERENCES `user_cloud_provider`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

