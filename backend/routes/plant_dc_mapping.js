const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/plant-dc-mapping - Get all SKU-DC mappings
router.get('/', async (req, res) => {
  try {
    const allMappings = await pool.query(`
      SELECT
          sdm.sku_id,
          s.name AS sku_name,
          sdm.dc_id,
          d.name AS dc_name,
          d.region
      FROM sku_dc_mapping sdm
      JOIN skus s ON sdm.sku_id = s.id
      JOIN dcs d ON sdm.dc_id = d.id
      ORDER BY d.name, s.name
    `);
    res.json(allMappings.rows);
  } catch (err) {
    console.error('Error fetching SKU-DC mappings:', err.message);
    res.status(500).json({ error: 'Failed to fetch SKU-DC mappings' });
  }
});

// POST /api/plant-dc-mapping - Create a new SKU-DC mapping
router.post('/', async (req, res) => {
  try {
    const { sku_id, dc_id } = req.body;
    const newMapping = await pool.query(
      'INSERT INTO sku_dc_mapping (sku_id, dc_id) VALUES ($1, $2) RETURNING *'
      [sku_id, dc_id]
    );
    res.status(201).json(newMapping.rows[0]);
  } catch (err) {
    console.error('Error creating SKU-DC mapping:', err.message);
    res.status(500).json({ error: 'Failed to create SKU-DC mapping' });
  }
});

// DELETE /api/plant-dc-mapping - Delete an SKU-DC mapping
router.delete('/', async (req, res) => {
  try {
    const { sku_id, dc_id } = req.body; // Assuming deletion by composite key
    const deletedMapping = await pool.query(
      'DELETE FROM sku_dc_mapping WHERE sku_id = $1 AND dc_id = $2 RETURNING *'
      [sku_id, dc_id]
    );
    if (deletedMapping.rows.length === 0) {
      return res.status(404).json({ error: 'SKU-DC mapping not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting SKU-DC mapping:', err.message);
    res.status(500).json({ error: 'Failed to delete SKU-DC mapping' });
  }
});

module.exports = router;