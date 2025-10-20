const db = require('./db');

async function testQuery() {
  try {
    const result = await db.query(`
      SELECT
          s.name AS sku,
          d.name AS dc,
          s.segment,
          COALESCE(MAX(CASE WHEN f.week = 45 THEN f.forecast_volume ELSE 0 END), 0) AS week45,
          COALESCE(MAX(CASE WHEN f.week = 46 THEN f.forecast_volume ELSE 0 END), 0) AS week46,
          COALESCE(MAX(CASE WHEN f.week = 47 THEN f.forecast_volume ELSE 0 END), 0) AS week47,
          COALESCE(MAX(f.accuracy), 0) AS accuracy
      FROM skus s
      LEFT JOIN sku_dc_mapping m ON s.id = m.sku_id
      LEFT JOIN dcs d ON m.dc_id = d.id
      LEFT JOIN forecasts f ON s.id = f.sku_id AND m.dc_id = f.dc_id
      WHERE s.id IN (SELECT sku_id FROM forecasts WHERE week IN (45, 46, 47))
      GROUP BY s.name, d.name, s.segment
      LIMIT 5
    `);
    console.log('Query result:', result.rows);
  } catch (err) {
    console.error('Error:', err);
  }
}

testQuery();
