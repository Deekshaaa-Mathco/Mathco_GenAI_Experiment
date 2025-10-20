const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/skus - Get all SKUs
router.get('/', async (req, res) => {
  try {
    const allSkus = await pool.query('SELECT id, name, segment, category, brand, pack_size, pack_type FROM skus');
    res.json(allSkus.rows);
  } catch (err) {
    console.error('Error fetching SKUs:', err.message);
    res.status(500).json({ error: 'Failed to fetch SKUs' });
  }
});

// POST /api/skus - Create a new SKU
router.post('/', async (req, res) => {
  try {
    const { name, segment, is_strategic, service_level, bom, category, brand, pack_size, pack_type } = req.body;
    const newSku = await pool.query(
      'INSERT INTO skus (id, name, segment, is_strategic, service_level, bom, category, brand, pack_size, pack_type) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *'
      [name, segment, is_strategic, service_level, bom, category, brand, pack_size, pack_type]
    );
    res.status(201).json(newSku.rows[0]);
  } catch (err) {
    console.error('Error creating SKU:', err.message);
    res.status(500).json({ error: 'Failed to create SKU' });
  }
});

// GET /api/skus/segments - Get all unique segments
router.get('/segments', async (req, res) => {
  try {
    const segments = await pool.query('SELECT DISTINCT segment FROM skus');
    res.json(segments.rows.map(row => row.segment));
  } catch (err) {
    console.error('Error fetching segments:', err.message);
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
});

// GET /api/skus/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await pool.query('SELECT DISTINCT category FROM skus');
    res.json(categories.rows.map(row => row.category));
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/skus/brands - Get all unique brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await pool.query('SELECT DISTINCT brand FROM skus');
    res.json(brands.rows.map(row => row.brand));
  } catch (err) {
    console.error('Error fetching brands:', err.message);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// GET /api/skus/packSizes - Get all unique pack sizes
router.get('/packSizes', async (req, res) => {
  try {
    const packSizes = await pool.query('SELECT DISTINCT pack_size FROM skus');
    res.json(packSizes.rows.map(row => row.pack_size));
  } catch (err) {
    console.error('Error fetching pack sizes:', err.message);
    res.status(500).json({ error: 'Failed to fetch pack sizes' });
  }
});

// GET /api/skus/packTypes - Get all unique pack types
router.get('/packTypes', async (req, res) => {
  try {
    const packTypes = await pool.query('SELECT DISTINCT pack_type FROM skus');
    res.json(packTypes.rows.map(row => row.pack_type));
  } catch (err) {
    console.error('Error fetching pack types:', err.message);
    res.status(500).json({ error: 'Failed to fetch pack types' });
  }
});

module.exports = router;