-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `capital` VARCHAR(100) NULL,
    `region` VARCHAR(100) NULL,
    `population` BIGINT NOT NULL,
    `currency_code` CHAR(3) NULL,
    `exchange_rate` DECIMAL(65, 30) NULL,
    `estimated_gdp` DECIMAL(65, 30) NOT NULL,
    `flag_url` VARCHAR(255) NULL,
    `last_refreshed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
