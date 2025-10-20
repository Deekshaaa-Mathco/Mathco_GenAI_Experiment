const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/plant-priority - Get all plants with their priorities
router.get('/', async (req, res) => {
  try {
    const allPlants = await pool.query('SELECT id, name, priority FROM plants ORDER BY priority, name');
    res.json(allPlants.rows);
  } catch (err) {
    console.error('Error fetching plant priorities:', err.message);
    res.status(500).json({ error: 'Failed to fetch plant priorities' });
  }
});

// PUT /api/plant-priority/:id - Update a plant's priority
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const updatedPlant = await pool.query(
      'UPDATE plants SET priority = $1 WHERE id = $2 RETURNING *'
      [priority, id]
    );
    if (updatedPlant.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.json(updatedPlant.rows[0]);
  } catch (err) {
    console.error('Error updating plant priority:', err.message);
    res.status(500).json({ error: 'Failed to update plant priority' });
  }
});

module.exports = router;