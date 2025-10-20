// backend/routes/mrp.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/mrp
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mrp ORDER BY week DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;