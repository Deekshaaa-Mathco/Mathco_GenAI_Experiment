const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/plant-line-mapping - Get all SKU-Line mappings
router.get('/', async (req, res) => {
  try {
    const allMappings = await pool.query(`
      SELECT
          slm.sku_id,
          s.name AS sku_name,
          slm.line_id,
          l.name AS line_name,
          p.name AS plant_name
      FROM sku_line_mapping slm
      JOIN skus s ON slm.sku_id = s.id
      JOIN lines l ON slm.line_id = l.id
      JOIN plants p ON l.plant_id = p.id
      ORDER BY p.name, l.name, s.name
    `);
    res.json(allMappings.rows);
  } catch (err) {
    console.error('Error fetching SKU-Line mappings:', err.message);
    res.status(500).json({ error: 'Failed to fetch SKU-Line mappings' });
  }
});

// POST /api/plant-line-mapping - Create a new SKU-Line mapping
router.post('/', async (req, res) => {
  try {
    const { sku_id, line_id } = req.body;
    const newMapping = await pool.query(
      'INSERT INTO sku_line_mapping (sku_id, line_id) VALUES ($1, $2) RETURNING *'
      [sku_id, line_id]
    );
    res.status(201).json(newMapping.rows[0]);
  } catch (err) {
    console.error('Error creating SKU-Line mapping:', err.message);
    res.status(500).json({ error: 'Failed to create SKU-Line mapping' });
  }
});

// DELETE /api/plant-line-mapping - Delete an SKU-Line mapping
router.delete('/', async (req, res) => {
  try {
    const { sku_id, line_id } = req.body; // Assuming deletion by composite key
    const deletedMapping = await pool.query(
      'DELETE FROM sku_line_mapping WHERE sku_id = $1 AND line_id = $2 RETURNING *'
      [sku_id, line_id]
    );
    if (deletedMapping.rows.length === 0) {
      return res.status(404).json({ error: 'SKU-Line mapping not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting SKU-Line mapping:', err.message);
    res.status(500).json({ error: 'Failed to delete SKU-Line mapping' });
  }
});

module.exports = router;