-- =====================================================================
-- TeamPulse — Hosted Database Schema
-- MySQL 8.x  (TiDB Cloud / Railway / Clever Cloud / any hosted MySQL)
--
-- Use this file when the database already exists and you cannot issue
-- CREATE DATABASE or USE statements (most hosted providers).
--
-- Apply with:
--   cd backend && npm run migrate:hosted
--
-- The original database/schema.sql is unchanged and is still used for
-- local development via:  npm run migrate
-- =====================================================================

-- Drop in dependency order so the script is re-runnable.
-- ⚠ These DROP statements will destroy existing data in these tables.
-- Safe to run on a FRESH empty database; destructive on an existing one.
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(255)        NOT NULL UNIQUE,
  password   VARCHAR(255)        NOT NULL,                -- bcrypt hash
  role       ENUM('admin','employee') NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200)       NOT NULL,
  description TEXT               NULL,
  assigned_to INT                NULL,
  status      ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  due_date    DATE               NULL,
  created_at  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP
                                          ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_assigned_to
    FOREIGN KEY (assigned_to) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_tasks_assigned_to (assigned_to),
  INDEX idx_tasks_status      (status),
  INDEX idx_tasks_due_date    (due_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- activity_logs  (bonus — audit trail)
-- ---------------------------------------------------------------------
CREATE TABLE activity_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NULL,
  action     VARCHAR(50)  NOT NULL,        -- e.g. CREATE_TASK, UPDATE_TASK
  entity     VARCHAR(50)  NOT NULL,        -- e.g. task, user, system
  entity_id  INT          NULL,
  details    VARCHAR(500) NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_logs_created_at (created_at)
) ENGINE=InnoDB;
