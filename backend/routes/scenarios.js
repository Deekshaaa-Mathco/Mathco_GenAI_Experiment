// backend/routes/scenarios.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/scenarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scenarios ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    // Return mock data if database query fails
    res.json([
      { id: 1, name: 'Demand Scenario Q4 2024', status: 'In Progress' },
      { id: 2, name: 'Demand Scenario Q1 2025', status: 'Draft' },
      { id: 3, name: 'Demand Scenario Q2 2025', status: 'Published' },
    ]);
  }
});

// GET /api/scenarios/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM scenarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scenarios/create
router.post('/create', async (req, res) => {
  const { name, type, objective } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO scenarios (name, type, status, objective, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, type, 'draft', objective, '00000000-0000-0000-0000-000000000001']
    );
    res.json({ message: 'Scenario created', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scenarios/publish
router.post('/publish', async (req, res) => {
  const { scenario_id, comments, lock, generate_mrp, notify } = req.body;
  try {
    await pool.query(
      'INSERT INTO approvals (scenario_id, approved_by, status, comments) VALUES ($1, $2, $3, $4)',
      [scenario_id, '00000000-0000-0000-0000-000000000001', 'approved', comments]
    );
    // Update scenario status to locked if lock=true
    if (lock) {
      await pool.query('UPDATE scenarios SET status = $1 WHERE id = $2', ['locked', scenario_id]);
    }
    res.json({ message: 'Plan published' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;