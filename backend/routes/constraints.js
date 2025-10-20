// backend/routes/constraints.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/constraints
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM constraints');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/constraints/update
router.post('/update', async (req, res) => {
  const { warehouse, production } = req.body;
  try {
    // Update warehouse constraints
    for (const constraint of warehouse) {
      await pool.query(
        'UPDATE constraints SET max_capacity = $1, available_capacity = $2, updated_at = CURRENT_TIMESTAMP WHERE dc = $3',
        [constraint.max, constraint.available, constraint.dc]
      );
    }
    // Update production constraints
    for (const constraint of production) {
      await pool.query(
        'UPDATE constraints SET max_capacity = $1, planned_capacity = $2, updated_at = CURRENT_TIMESTAMP WHERE plant = $3 AND line = $4',
        [constraint.max, constraint.planned, constraint.plant, constraint.line]
      );
    }
    res.json({ message: 'Constraints updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;