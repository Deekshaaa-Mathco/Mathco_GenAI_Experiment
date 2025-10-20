const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/dcs - Get all DCs
router.get('/', async (req, res) => {
  try {
    const allDcs = await pool.query('SELECT id, name, region FROM dcs');
    res.json(allDcs.rows);
  } catch (err) {
    console.error('Error fetching DCs:', err.message);
    res.status(500).json({ error: 'Failed to fetch DCs' });
  }
});

module.exports = router;