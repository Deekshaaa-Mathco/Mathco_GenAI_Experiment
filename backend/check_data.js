const db = require('./db');

async function checkData() {
  try {
    const forecastCount = await db.query('SELECT COUNT(*) FROM forecasts');
    console.log('Forecasts count:', forecastCount.rows[0].count);

    const skusCount = await db.query('SELECT COUNT(*) FROM skus');
    console.log('SKUs count:', skusCount.rows[0].count);

    const dcsCount = await db.query('SELECT COUNT(*) FROM dcs');
    console.log('DCs count:', dcsCount.rows[0].count);

    const mappingCount = await db.query('SELECT COUNT(*) FROM sku_dc_mapping');
    console.log('SKU-DC mappings count:', mappingCount.rows[0].count);

    const sampleForecasts = await db.query('SELECT * FROM forecasts LIMIT 5');
    console.log('Sample forecasts:', sampleForecasts.rows);

    const sampleSkus = await db.query('SELECT * FROM skus LIMIT 5');
    console.log('Sample SKUs:', sampleSkus.rows);

    const sampleMappings = await db.query('SELECT * FROM sku_dc_mapping LIMIT 5');
    console.log('Sample mappings:', sampleMappings.rows);

  } catch (err) {
    console.error('Error:', err);
  }
}

checkData();
