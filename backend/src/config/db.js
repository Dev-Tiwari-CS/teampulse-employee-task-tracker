/**
 * MySQL connection pool.
 * We use mysql2's promise pool so every query returns a Promise and we can
 * use async/await throughout the service layer.
 *
 * TLS / hosted-DB support:
 *   Set DB_SSL=true in your environment to enable TLS with certificate
 *   verification (rejectUnauthorized: true). Required for TiDB Cloud,
 *   PlanetScale, and other hosted MySQL providers that mandate TLS.
 *   Leave DB_SSL unset (or any value other than 'true') for local development
 *   — the ssl option is omitted entirely, so local behaviour is unchanged.
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

// Build the optional TLS config. Only added when DB_SSL=true so that local
// development (where DB_SSL is not set) is completely unaffected.
const sslConfig =
  process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: true } }
    : {};

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             Number(process.env.DB_PORT) || 3306,
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'task_tracker',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  dateStrings:      true, // return DATE/DATETIME as 'YYYY-MM-DD' strings, not JS Date objects
  ...sslConfig,           // {} when DB_SSL != 'true', { ssl: {...} } when DB_SSL=true
});

/**
 * Tiny helper so callers can do `const rows = await query(sql, params)`
 * without destructuring [rows, fields] every time.
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, query };
