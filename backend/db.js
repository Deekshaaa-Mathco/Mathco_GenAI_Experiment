require('dotenv').config({ path: __dirname + '/.env', debug: true });
const { Pool } = require('pg');

console.log('Current directory:', __dirname);
console.log('Attempting to load .env from:', __dirname + '/.env');
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Mandatory for Supabase
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client:', err.stack);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};