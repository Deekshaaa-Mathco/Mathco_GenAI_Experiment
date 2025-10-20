const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/adjustments', async (req, res) => {
  try {
    const adjustments = req.body;
    // Insert adjustments into database
    for (const adj of adjustments) {
      await db.query(
        'INSERT INTO commercial_adjustments (sku, dc, volume, reason, date) VALUES ($1, $2, $3, $4, $5)',
        [adj.sku, adj.dc, adj.volume, adj.reason, adj.date]
      );
    }
    res.status(201).json({ message: 'Adjustments saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/adjustments/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const adjustments = await db.query('SELECT * FROM commercial_adjustments WHERE sku = $1', [sku]);
    res.json(adjustments.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
