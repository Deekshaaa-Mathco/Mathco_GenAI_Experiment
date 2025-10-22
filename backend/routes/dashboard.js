const express = require('express');
const db = require('../db');
const router = express.Router();

// 1. /api/dashboard/kpis - FETCH KPIs FROM DB
router.get('/kpis', async (req, res) => {
  try {
    console.log('🔄 Fetching KPIs...');

    // Forecast Accuracy & Bias from forecasts
    const forecastRes = await db.query(`
      SELECT AVG(accuracy) as avg_accuracy, AVG(bias) as avg_bias 
      FROM forecasts
    `);
    const forecast = forecastRes.rows[0] || { avg_accuracy: 0, avg_bias: 0 };

    // Plan Attainment from approvals
    const attainmentRes = await db.query(`
      SELECT (COUNT(*) FILTER (WHERE status = 'approved') * 100.0 / COUNT(*)) as attainment 
      FROM approvals
    `);
    const attainment = attainmentRes.rows[0]?.attainment || 0;

    // OOS Risk from mrp
    const oosRes = await db.query(`
      SELECT COUNT(*) as oos_risk_skus FROM mrp WHERE status = 'Shortage'
    `);
    const oos_risk_skus = oosRes.rows[0]?.oos_risk_skus || 0;

    res.json({
      forecast_accuracy: parseFloat(forecast.avg_accuracy) || 0,
      bias: parseFloat(forecast.avg_bias) || 0,
      plan_attainment: parseFloat(attainment) || 0,
      oos_risk_skus: parseInt(oos_risk_skus) || 0
    });

    console.log('✅ KPIs sent!');
  } catch (err) {
    console.error('❌ KPI error:', err);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

// 2. /api/scenarios - DEMAND PLANS (type = 'demand')
router.get('/scenarios', async (req, res) => {
  try {
    console.log('🔄 Fetching scenarios (demand plans)...');

    const resData = await db.query(`
      SELECT name as plan_name, status, created_at as created_date, created_at as last_modified 
      FROM scenarios WHERE type = 'demand' ORDER BY created_at DESC
    `);

    res.json(resData.rows);

    console.log('✅ Demand plans sent:', resData.rows.length);
  } catch (err) {
    console.error('❌ Scenarios error:', err);
    res.status(500).json({ error: 'Failed to fetch demand plans' });
  }
});

// 3. /api/supply/plans - SUPPLY PLANS (type = 'supply')
router.get('/supply/plans', async (req, res) => {
  try {
    console.log('🔄 Fetching supply plans...');

    const resData = await db.query(`
      SELECT name as plan_name, status, created_at as created_date, created_at as last_modified 
      FROM scenarios WHERE type = 'supply' ORDER BY created_at DESC
    `);

    res.json(resData.rows);

    console.log('✅ Supply plans sent:', resData.rows.length);
  } catch (err) {
    console.error('❌ Supply plans error:', err);
    res.status(500).json({ error: 'Failed to fetch supply plans' });
  }
});

module.exports = router;