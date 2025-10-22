require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connection
pool.connect()
  .then(() => console.log('✅ DATABASE CONNECTED!'))
  .catch(err => console.error('❌ DATABASE ERROR:', err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
};