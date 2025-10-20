const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/line-downtime-constraints - Get all line downtime constraints
router.get('/', async (req, res) => {
  try {
    const allConstraints = await pool.query(`
      SELECT
          c.id,
          c.type,
          c.line_id,
          l.name AS line_name,
          p.name AS plant_name,
          c.max_capacity,
          c.available_capacity -- Can be used to represent downtime impact
      FROM constraints c
      JOIN lines l ON c.line_id = l.id
      JOIN plants p ON l.plant_id = p.id
      WHERE c.type = 'line_downtime'
      ORDER BY plant_name, line_name
    `);
    res.json(allConstraints.rows);
  } catch (err) {
    console.error('Error fetching line downtime constraints:', err.message);
    res.status(500).json({ error: 'Failed to fetch line downtime constraints' });
  }
});

// POST /api/line-downtime-constraints - Create a new line downtime constraint
router.post('/', async (req, res) => {
  try {
    const { line_id, max_capacity, available_capacity } = req.body; // available_capacity can represent reduced capacity due to downtime
    const newConstraint = await pool.query(
      'INSERT INTO constraints (id, type, line_id, max_capacity, available_capacity) VALUES (gen_random_uuid(), \'line_downtime\', $1, $2, $3) RETURNING *',
      [line_id, max_capacity, available_capacity]
    );
    res.status(201).json(newConstraint.rows[0]);
  } catch (err) {
    console.error('Error creating line downtime constraint:', err.message);
    res.status(500).json({ error: 'Failed to create line downtime constraint' });
  }
});

// PUT /api/line-downtime-constraints/:id - Update a line downtime constraint
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { max_capacity, available_capacity } = req.body;
    const updatedConstraint = await pool.query(
      'UPDATE constraints SET max_capacity = $1, available_capacity = $2 WHERE id = $3 AND type = \'line_downtime\' RETURNING *',
      [max_capacity, available_capacity, id]
    );
    if (updatedConstraint.rows.length === 0) {
      return res.status(404).json({ error: 'Line downtime constraint not found or not of type \'line_downtime\'' });
    }
    res.json(updatedConstraint.rows[0]);
  } catch (err) {
    console.error('Error updating line downtime constraint:', err.message);
    res.status(500).json({ error: 'Failed to update line downtime constraint' });
  }
});

// DELETE /api/line-downtime-constraints/:id - Delete a line downtime constraint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConstraint = await pool.query(
      'DELETE FROM constraints WHERE id = $1 AND type = \'line_downtime\' RETURNING *',
      [id]
    );
    if (deletedConstraint.rows.length === 0) {
      return res.status(404).json({ error: 'Line downtime constraint not found or not of type \'line_downtime\'' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting line downtime constraint:', err.message);
    res.status(500).json({ error: 'Failed to delete line downtime constraint' });
  }
});

module.exports = router;
