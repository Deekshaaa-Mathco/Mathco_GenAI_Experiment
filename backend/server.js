require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://mathco-gen-ai-experiment-6ld6.vercel.app'],  // Local + Vercel frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/demand', require('./routes/demand'));
app.use('/api/supply', require('./routes/supply'));
app.use('/api/model', require('./routes/model'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/mrp', require('./routes/mrp'));
app.use('/api/constraints', require('./routes/constraints'));
app.use('/api/commercial', require('./routes/commercial'));
app.use('/api/skus', require('./routes/skus'));
app.use('/api/dcs', require('./routes/dcs'));
app.use('/api/reason-codes', require('./routes/reason_codes'));
app.use('/api/plant-line-mapping', require('./routes/plant_line_mapping'));
app.use('/api/plant-dc-mapping', require('./routes/plant_dc_mapping'));
app.use('/api/line-downtime-constraints', require('./routes/line_downtime_constraints'));
app.use('/api/plant-priority', require('./routes/plant_priority'));

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', database: 'Failed' });
  }
});

// Vercel requires module.exports for serverless
module.exports = app;  // ← Key for Vercel