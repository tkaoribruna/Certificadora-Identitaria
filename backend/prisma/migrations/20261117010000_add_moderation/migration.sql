-- AlterTable
ALTER TABLE `Comment` MODIFY `content` TEXT NOT NULL,
    ADD COLUMN `moderationReason` VARCHAR(500) NULL,
    ADD COLUMN `moderationStatus` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE `DiscussionTopic` MODIFY `description` TEXT NOT NULL,
    ADD COLUMN `moderationReason` VARCHAR(500) NULL,
    ADD COLUMN `moderationStatus` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED';
