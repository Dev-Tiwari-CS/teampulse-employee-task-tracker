/**
 * Applies database/schema-hosted.sql against a pre-created hosted MySQL
 * database (TiDB Cloud, Railway, Clever Cloud, etc.).
 *
 * Unlike migrate.js, this script:
 *   - Connects directly to DB_NAME (the database must already exist).
 *   - Does NOT issue CREATE DATABASE or USE statements.
 *   - Supports TLS via DB_SSL=true.
 *   - Refuses to run if ANY base table already exists in the target database.
 *     This protects against accidental data loss on a non-empty database.
 *
 * Usage:
 *   npm run migrate:hosted
 *
 * Required environment variables (all read from .env or the host's env panel):
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL
 */
require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

async function migrateHosted() {
  // ── 1. Resolve and read the schema file before opening a connection.
  const schemaPath = path.join(
    __dirname, '..', '..', '..', 'database', 'schema-hosted.sql'
  );

  if (!fs.existsSync(schemaPath)) {
    console.error('✗ schema-hosted.sql not found at:', schemaPath);
    process.exit(1);
  }

  const sql    = fs.readFileSync(schemaPath, 'utf8');
  const dbName = process.env.DB_NAME || 'task_tracker';

  // ── 2. Build optional TLS config.
  //       DB_SSL=true  → TLS with full certificate verification (rejectUnauthorized: true).
  //       DB_SSL unset → no ssl key in the config; local dev is unaffected.
  const sslConfig =
    process.env.DB_SSL === 'true'
      ? { ssl: { rejectUnauthorized: true } }
      : {};

  // ── 3. Open connection. If this throws, there is nothing to clean up.
  const conn = await mysql.createConnection({
    host:               process.env.DB_HOST     || 'localhost',
    port:               Number(process.env.DB_PORT) || 3306,
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           dbName,  // must already exist on the hosted provider
    multipleStatements: true,
    ...sslConfig,
  });

  // ── 4. conn.end() is called in finally on EVERY exit path.
  //       process.exit() is only called in the outer .catch(), after cleanup.
  try {
    // ── 4a. Pre-flight: abort if ANY base table already exists.
    //        Checks all user-created tables in this schema, not just the
    //        three application tables, so the guard works regardless of what
    //        was previously created in the database.
    const [tables] = await conn.query(
      `SELECT TABLE_NAME
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ?
         AND TABLE_TYPE   = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [dbName]
    );

    if (tables.length > 0) {
      const names = tables.map((r) => r.TABLE_NAME).join(', ');
      // Throw so that finally runs (closes connection) before the process exits.
      throw new Error(
        `Database "${dbName}" is not empty.\n` +
        `  Existing tables: ${names}\n` +
        `  Hosted migration requires a completely empty database.\n` +
        `  Drop the existing tables manually before running this script.`
      );
    }

    // ── 4b. Database is empty — apply the schema.
    await conn.query(sql);
    console.log(`✓ Schema applied successfully to: ${dbName}`);

  } finally {
    // Always close the connection exactly once, whether we succeeded,
    // threw from the pre-flight check, or threw during schema execution.
    await conn.end();
  }
}

// process.exit(1) is called here — AFTER migrateHosted() has resolved or
// rejected, meaning finally has already run and conn.end() has been called.
migrateHosted().catch((err) => {
  console.error('✗ Hosted migration failed:', err.message);
  process.exit(1);
});
