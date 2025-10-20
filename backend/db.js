const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'coca_cola_planning',
  password: 'deeksha',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
