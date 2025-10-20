const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/review', async (req, res) => {
  try {
    // Fetch segmentation data
    const segmentation = await db.query('SELECT segment, COUNT(*) as count, AVG(service_level) as service FROM skus GROUP BY segment');
    console.log('Segmentation Data:', segmentation.rows);

    // Add default volume since column doesn't exist
    const segmentationWithVolume = segmentation.rows.map(row => ({
      ...row,
      volume: 0  // Placeholder; can be calculated from forecasts if needed
    }));

    const { skuId, dcId, segment, category, brand, packSize, packType, startWeek, endWeek } = req.query;
    const queryParams = [];
    let queryIndex = 1;

    let forecastQuery = `
      SELECT
          s.id AS sku_id,
          s.name AS sku_name,
          s.segment,
          s.category,
          s.brand,
          s.pack_size,
          s.pack_type,
          d.id AS dc_id,
          d.name AS dc_name,
          f.week,
          f.forecast_volume,
          f.actual_volume,
          f.bias,
          f.model_type,
          COALESCE(adj.adjustment_volume, 0) AS adjustment_volume,
          COALESCE(adj.reason_code, '') AS adjustment_reason
      FROM skus s
      JOIN sku_dc_mapping sdm ON s.id = sdm.sku_id
      JOIN dcs d ON sdm.dc_id = d.id
      LEFT JOIN forecasts f ON s.id = f.sku_id AND d.id = f.dc_id
      LEFT JOIN adjustments adj ON f.id = adj.forecast_id
      WHERE 1=1
    `;

    if (skuId) {
      queryParams.push(skuId);
      forecastQuery += ` AND s.id = $${queryIndex++}`;
    }
    if (dcId) {
      queryParams.push(dcId);
      forecastQuery += ` AND d.id = $${queryIndex++}`;
    }
    if (segment) {
      queryParams.push(segment);
      forecastQuery += ` AND s.segment = $${queryIndex++}`;
    }
    if (category) {
      queryParams.push(category);
      forecastQuery += ` AND s.category = $${queryIndex++}`;
    }
    if (brand) {
      queryParams.push(brand);
      forecastQuery += ` AND s.brand = $${queryIndex++}`;
    }
    if (packSize) {
      queryParams.push(packSize);
      forecastQuery += ` AND s.pack_size = $${queryIndex++}`;
    }
    if (packType) {
      queryParams.push(packType);
      forecastQuery += ` AND s.pack_type = $${queryIndex++}`;
    }
    if (startWeek) {
      queryParams.push(parseInt(startWeek));
      forecastQuery += ` AND f.week >= $${queryIndex++}`;
    }
    if (endWeek) {
      queryParams.push(parseInt(endWeek));
      forecastQuery += ` AND f.week <= $${queryIndex++}`;
    }

    forecastQuery += ` ORDER BY s.name, d.name, f.week`;

    const forecastData = await db.query(forecastQuery, queryParams);

    // Fetch scenarios
    const scenarios = await db.query('SELECT name FROM scenarios WHERE status = \'draft\' ORDER BY created_at DESC');
    console.log('Scenarios Data:', scenarios.rows);

    res.json({
      segmentation: Object.fromEntries(segmentationWithVolume.map(row => [row.segment, { count: row.count, volume: row.volume, service: row.service }])),

      forecast: forecastData.rows,
      scenarios: scenarios.rows,
    });
  } catch (err) {
    console.error('Error in /review endpoint:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.put('/forecast/:forecastId', async (req, res) => {
  try {
    const { forecastId } = req.params;
    const { adjustment_volume, reason_code, userId } = req.body; // userId will be from authenticated user

    // Check if an adjustment already exists for this forecastId
    const existingAdjustment = await db.query(
      'SELECT * FROM adjustments WHERE forecast_id = $1',
      [forecastId]
    );

    if (existingAdjustment.rows.length > 0) {
      // Update existing adjustment
      await db.query(
        'UPDATE adjustments SET adjustment_volume = $1, reason_code = $2, user_id = $3, created_at = CURRENT_TIMESTAMP WHERE forecast_id = $4',
        [adjustment_volume, reason_code, userId, forecastId]
      );
    } else {
      // Insert new adjustment
      await db.query(
        'INSERT INTO adjustments (id, forecast_id, adjustment_volume, reason_code, user_id) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
        [forecastId, adjustment_volume, reason_code, userId]
      );
    }

    res.status(200).json({ message: 'Forecast adjustment updated successfully' });
  } catch (err) {
    console.error('Error in /forecast/:forecastId PUT endpoint:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/segments', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT segment FROM skus ORDER BY segment');
    res.json(result.rows.map(row => row.segment));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT category FROM skus ORDER BY category');
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/brands', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT brand FROM skus ORDER BY brand');
    res.json(result.rows.map(row => row.brand));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pack-sizes', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT pack_size FROM skus ORDER BY pack_size');
    res.json(result.rows.map(row => row.pack_size));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pack-types', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT pack_type FROM skus ORDER BY pack_type');
    res.json(result.rows.map(row => row.pack_type));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
