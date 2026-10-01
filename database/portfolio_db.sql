-- Database: portfolio_db
-- Generated for Minimalist Monochrome Full-Stack Portfolio

CREATE DATABASE IF NOT EXISTS `portfolio_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio_db`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS `profiles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `short_bio` TEXT,
    `biography` LONGTEXT,
    `career_goals` TEXT,
    `email` VARCHAR(100),
    `phone` VARCHAR(50),
    `location` VARCHAR(100),
    `profile_image` VARCHAR(255) DEFAULT '',
    `resume_url` VARCHAR(255) DEFAULT '',
    `availability` VARCHAR(50) DEFAULT 'Available for Freelance & Full-time',
    `website_title` VARCHAR(100) DEFAULT 'Portfolio | Minimalist Monochrome',
    `website_description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `long_description` LONGTEXT,
    `image` VARCHAR(255) DEFAULT '',
    `additional_images` TEXT DEFAULT NULL,
    `technologies` VARCHAR(255) NOT NULL,
    `github_url` VARCHAR(255) DEFAULT '',
    `live_url` VARCHAR(255) DEFAULT '',
    `category` VARCHAR(50) DEFAULT 'Web App',
    `featured` TINYINT(1) DEFAULT 0,
    `published` TINYINT(1) DEFAULT 1,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `proficiency` INT DEFAULT 85,
    `icon` VARCHAR(50) DEFAULT 'code',
    `sort_order` INT DEFAULT 0,
    `enabled` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Experiences Table
CREATE TABLE IF NOT EXISTS `experiences` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_title` VARCHAR(100) NOT NULL,
    `company` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100) DEFAULT '',
    `start_date` VARCHAR(50) NOT NULL,
    `end_date` VARCHAR(50) DEFAULT 'Present',
    `currently_working` TINYINT(1) DEFAULT 0,
    `description` TEXT,
    `responsibilities` TEXT,
    `technologies` VARCHAR(255) DEFAULT '',
    `sort_order` INT DEFAULT 0,
    `enabled` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Educations Table
CREATE TABLE IF NOT EXISTS `educations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `school` VARCHAR(150) NOT NULL,
    `degree` VARCHAR(100) NOT NULL,
    `field` VARCHAR(100) NOT NULL,
    `start_year` VARCHAR(20) NOT NULL,
    `end_year` VARCHAR(20) NOT NULL,
    `description` TEXT,
    `certificate_url` VARCHAR(255) DEFAULT '',
    `logo` VARCHAR(255) DEFAULT '',
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Social Links Table
CREATE TABLE IF NOT EXISTS `social_links` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `platform` VARCHAR(50) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(50) NOT NULL,
    `sort_order` INT DEFAULT 0,
    `enabled` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `key_name` VARCHAR(50) NOT NULL UNIQUE,
    `key_value` TEXT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Seed Data
-- -------------------------------------------------------------

-- Admin (Username: admin, Email: admin@portfolio.com, Password: admin123)
INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'admin', 'admin@portfolio.com', '$2y$10$zt9H.Ip8HpQ5V2421e.ifetKH0JSMbeHNUvHkfwLhNJp4N1n0.XHG')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- Profile
INSERT INTO `profiles` (`id`, `name`, `title`, `short_bio`, `biography`, `career_goals`, `email`, `phone`, `location`, `profile_image`, `resume_url`, `availability`, `website_title`, `website_description`) VALUES
(1, 'Alex Morgan', 'Full-Stack Software Engineer', 'I craft minimalist, high-performance web applications and robust digital architectures.', 'Hello! I am a full-stack developer with over 5 years of experience architecting resilient web platforms, API ecosystems, and intuitive user interfaces. I believe in clean code, radical minimalism, and creating web experiences that are both functionally powerful and aesthetically restrained.', 'My mission is to build scalable, human-centered systems while mastering distributed computing and developer tooling.', 'alex.morgan@example.com', '+1 (555) 019-2834', 'San Francisco, CA', '', '', 'Available for select freelance & full-time roles', 'Alex Morgan | Software Engineer', 'Personal portfolio of Alex Morgan, full-stack software engineer specializing in modern web architecture.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Projects
INSERT INTO `projects` (`id`, `title`, `slug`, `description`, `long_description`, `image`, `additional_images`, `technologies`, `github_url`, `live_url`, `category`, `featured`, `published`, `sort_order`) VALUES
(1, 'Aura Minimalist CMS', 'aura-minimalist-cms', 'A decoupled content management engine focused on extreme typography, speed, and markdown editing.', 'Aura is designed for creators who value simplicity and brutalist typography. It features instant markdown rendering, real-time collaboration via WebSockets, headless API distribution, and a microsecond response time with edge caching.', '', '[]', 'Vue.js, PHP, MySQL, Tailwind CSS', 'https://github.com/example/aura-cms', 'https://aura-demo.example.com', 'Web App', 1, 1, 1),
(2, 'Monolith Financial Platform', 'monolith-financial-platform', 'A real-time financial tracking dashboard with automated ledger balancing and high-volume data ingestion.', 'Monolith is an enterprise-grade accounting and analytics platform built for high-throughput transactional flows. It implements idempotent webhook processing, ledger reconciliation with double-entry accounting, and sub-second data streaming.', '', '[]', 'PHP, Vue 3, Tailwind CSS, Chart.js', 'https://github.com/example/monolith-finance', 'https://monolith-demo.example.com', 'FinTech', 1, 1, 2),
(3, 'Nexus Distributed Cloud Console', 'nexus-cloud-console', 'A unified management console for provisioning multi-region server clusters and telemetry metrics.', 'Nexus offers a single pane of glass for multi-cloud deployments. Features include live metrics inspection, automated canary deployments, rolling rollbacks, and customizable alerting policies.', '', '[]', 'JavaScript, REST APIs, MySQL, Docker', 'https://github.com/example/nexus-console', 'https://nexus-demo.example.com', 'DevOps', 1, 1, 3)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Skills
INSERT INTO `skills` (`id`, `name`, `category`, `proficiency`, `icon`, `sort_order`, `enabled`) VALUES
(1, 'HTML5 & CSS3', 'Frontend', 95, 'layout', 1, 1),
(2, 'JavaScript (ES6+)', 'Frontend', 92, 'code-2', 2, 1),
(3, 'Vue.js / React', 'Frontend', 90, 'layers', 3, 1),
(4, 'Tailwind CSS', 'Frontend', 94, 'palette', 4, 1),
(5, 'PHP & Object-Oriented Design', 'Backend', 90, 'server', 5, 1),
(6, 'REST API & Microservices', 'Backend', 88, 'network', 6, 1),
(7, 'Node.js & Express', 'Backend', 82, 'cpu', 7, 1),
(8, 'MySQL & phpMyAdmin', 'Database', 90, 'database', 8, 1),
(9, 'PostgreSQL & Prisma', 'Database', 85, 'hard-drive', 9, 1),
(10, 'Git & GitHub Workflows', 'Tools', 92, 'git-branch', 10, 1),
(11, 'Docker & Containerization', 'Tools', 80, 'box', 11, 1),
(12, 'Linux Server Administration', 'Tools', 85, 'terminal', 12, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Experience
INSERT INTO `experiences` (`id`, `job_title`, `company`, `location`, `start_date`, `end_date`, `currently_working`, `description`, `responsibilities`, `technologies`, `sort_order`, `enabled`) VALUES
(1, 'Senior Full-Stack Engineer', 'Vanguard Digital Labs', 'San Francisco, CA', '2023', 'Present', 1, 'Leading frontend architecture and core backend microservices for enterprise client products.', '• Architected real-time dashboard serving 100k+ daily active users\n• Reduced database query latency by 45% through index optimization and Redis caching\n• Mentored a team of 6 engineers on reactive frontend patterns and clean code principles', 'Vue.js, PHP, MySQL, Tailwind CSS, Redis', 1, 1),
(2, 'Full-Stack Web Developer', 'Apex Interactive Studio', 'Austin, TX', '2021', '2023', 0, 'Developed custom client web applications, e-commerce platforms, and internal admin tooling.', '• Built 15+ responsive bespoke client websites and administrative portals\n• Integrated payment processing with Stripe and PayPal APIs\n• Maintained 99.98% uptime across client production deployments', 'JavaScript, PHP, MySQL, Tailwind CSS, REST APIs', 2, 1)
ON DUPLICATE KEY UPDATE `job_title` = VALUES(`job_title`);

-- Education
INSERT INTO `educations` (`id`, `school`, `degree`, `field`, `start_year`, `end_year`, `description`, `certificate_url`, `logo`, `sort_order`) VALUES
(1, 'California Institute of Technology', 'Bachelor of Science', 'Computer Science', '2017', '2021', 'Graduated with honors. Focused on Distributed Systems, Software Engineering, and Database Architecture.', '', '', 1),
(2, 'Meta Certified Full-Stack Developer', 'Professional Certification', 'Web Architecture', '2022', '2022', 'Comprehensive industry certification covering advanced frontend state patterns, database scaling, and API security.', 'https://coursera.org/verify/example', '', 2)
ON DUPLICATE KEY UPDATE `school` = VALUES(`school`);

-- Social Links
INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `sort_order`, `enabled`) VALUES
(1, 'GitHub', 'https://github.com', 'github', 1, 1),
(2, 'LinkedIn', 'https://linkedin.com', 'linkedin', 2, 1),
(3, 'X / Twitter', 'https://x.com', 'twitter', 3, 1),
(4, 'Personal Website', 'https://example.com', 'globe', 4, 1)
ON DUPLICATE KEY UPDATE `platform` = VALUES(`platform`);

-- Initial Settings
INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('website_name', 'Alex Morgan'),
('website_title', 'Alex Morgan — Full-Stack Developer Portfolio'),
('meta_description', 'Minimalist monochrome portfolio of Alex Morgan, full-stack software engineer.'),
('contact_email', 'alex.morgan@example.com'),
('theme_preference', 'light'),
('portfolio_visibility', '1'),
('maintenance_mode', '0')
ON DUPLICATE KEY UPDATE `key_value` = VALUES(`key_value`);
