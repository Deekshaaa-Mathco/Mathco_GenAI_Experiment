const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/reason-codes - Get all reason codes
router.get('/', async (req, res) => {
  try {
    const allReasonCodes = await pool.query('SELECT id, code, description FROM reason_codes ORDER BY code');
    res.json(allReasonCodes.rows);
  } catch (err) {
    console.error('Error fetching reason codes:', err.message);
    res.status(500).json({ error: 'Failed to fetch reason codes' });
  }
});

// POST /api/reason-codes - Create a new reason code
router.post('/', async (req, res) => {
  try {
    const { code, description } = req.body;
    const newReasonCode = await pool.query(
      'INSERT INTO reason_codes (id, code, description) VALUES (gen_random_uuid(), $1, $2) RETURNING *'
      [code, description]
    );
    res.status(201).json(newReasonCode.rows[0]);
  } catch (err) {
    console.error('Error creating reason code:', err.message);
    res.status(500).json({ error: 'Failed to create reason code' });
  }
});

// PUT /api/reason-codes/:id - Update a reason code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description } = req.body;
    const updatedReasonCode = await pool.query(
      'UPDATE reason_codes SET code = $1, description = $2 WHERE id = $3 RETURNING *'
      [code, description, id]
    );
    if (updatedReasonCode.rows.length === 0) {
      return res.status(404).json({ error: 'Reason code not found' });
    }
    res.json(updatedReasonCode.rows[0]);
  } catch (err) {
    console.error('Error updating reason code:', err.message);
    res.status(500).json({ error: 'Failed to update reason code' });
  }
});

// DELETE /api/reason-codes/:id - Delete a reason code
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReasonCode = await pool.query(
      'DELETE FROM reason_codes WHERE id = $1 RETURNING *'
      [id]
    );
    if (deletedReasonCode.rows.length === 0) {
      return res.status(404).json({ error: 'Reason code not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting reason code:', err.message);
    res.status(500).json({ error: 'Failed to delete reason code' });
  }
});

module.exports = router;