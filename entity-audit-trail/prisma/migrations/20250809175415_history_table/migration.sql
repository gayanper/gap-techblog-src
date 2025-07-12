-- CreateTable
CREATE TABLE `EntityHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityId` INTEGER NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `changedBy` VARCHAR(191) NOT NULL,
    `changedAt` DATETIME(3) NOT NULL,
    `snapshot` JSON NOT NULL,
    `diff` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
