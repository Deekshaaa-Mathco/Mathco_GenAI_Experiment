require('dotenv').config({ path: __dirname + '/.env', debug: true });
const { Pool } = require('pg');
const url = require('url'); // Import the url module

console.log('Current directory:', __dirname);
console.log('Attempting to load .env from:', __dirname + '/.env');
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

// Parse the DATABASE_URL to extract components
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const pool = new Pool({
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,           // ✅ SSL ENFORCED (production secure)
    requestCert: true,
    require: true
  } : {
    rejectUnauthorized: false,           // Allow self-signed certificates for development
  },
  family: 4, // Force IPv4
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully with SSL');
    console.log('SSL Status:', client.ssl ? 'Enabled' : 'Disabled');
    release();
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client:', err.stack);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};