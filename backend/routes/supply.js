const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/planning', async (req, res) => {
  try {
    // DC Utilization
    const dcUtilization = await db.query(`
      SELECT
          d.id,
          d.name,
          d.max_capacity,
          d.available_capacity,
          (CAST(d.available_capacity AS DECIMAL) / d.max_capacity) * 100 AS utilization_percentage
      FROM dcs d
    `);

    // Plant Line Utilization
    const lineUtilization = await db.query(`
      SELECT
          l.id,
          l.name AS line_name,
          p.name AS plant_name,
          l.weekly_capacity,
          l.changeover_time,
          (CAST(l.weekly_capacity - l.changeover_time AS DECIMAL) / l.weekly_capacity) * 100 AS utilization_percentage
      FROM lines l
      JOIN plants p ON l.plant_id = p.id
    `);

    // Plant Line Summary (lines per plant)
    const plantLineSummary = await db.query(`
      SELECT
          p.id AS plant_id,
          p.name AS plant_name,
          COUNT(l.id) AS number_of_lines,
          SUM(l.weekly_capacity) AS total_weekly_capacity
      FROM plants p
      LEFT JOIN lines l ON p.id = l.plant_id
      GROUP BY p.id, p.name
    `);

    // Forecast vs Actual Sales (aggregated by week for visualization)
    const forecastActualSales = await db.query(`
      SELECT
          week,
          SUM(forecast_volume) AS total_forecast_volume,
          SUM(actual_volume) AS total_actual_volume
      FROM forecasts
      GROUP BY week
      ORDER BY week
    `);

    // Plant Allocation (mock data for now, as schema doesn't directly support this easily)
    // This would typically come from a more complex planning/allocation table
    const plantAllocation = [
      { plant_name: 'Bangalore Plant', allocated_capacity: 70000, total_capacity: 75000 },
      { plant_name: 'Delhi Plant', allocated_capacity: 30000, total_capacity: 40000 },
      { plant_name: 'Mumbai Plant', allocated_capacity: 25000, total_capacity: 28000 },
    ];

    // Plant DC Allocation (mock data for now, as schema doesn't directly support this easily)
    // This would typically come from a plant_dc_allocation table
    const plantDcAllocation = [
      { plant_name: 'Bangalore Plant', dc_name: 'Bangalore DC', allocated_volume: 15000 },
      { plant_name: 'Bangalore Plant', dc_name: 'Delhi DC', allocated_volume: 5000 },
      { plant_name: 'Delhi Plant', dc_name: 'Delhi DC', allocated_volume: 10000 },
      { plant_name: 'Mumbai Plant', dc_name: 'Mumbai DC', allocated_volume: 12000 },
    ];


    res.json({
      dcUtilization: dcUtilization.rows,
      lineUtilization: lineUtilization.rows,
      plantLineSummary: plantLineSummary.rows,
      forecastActualSales: forecastActualSales.rows,
      plantAllocation: plantAllocation, // Mock data
      plantDcAllocation: plantDcAllocation, // Mock data
    });
  } catch (err) {
    console.error('Error in /planning endpoint:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch supply planning data' });
  }
});

router.get('/plans', async (req, res) => {
  try {
    // Mock supply plans data - in a real app, this would come from a database
    const supplyPlans = [
      { id: 1, name: 'Supply Plan Q4 2024', status: 'In Progress' },
      { id: 2, name: 'Supply Plan Q1 2025', status: 'Draft' },
      { id: 3, name: 'Supply Plan Q2 2025', status: 'Published' },
    ];
    res.json(supplyPlans);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to fetch supply plans' });
  }
});

router.put('/utilization/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { value } = req.body; // The new utilization value

    if (type === 'dc') {
      // Update available_capacity in dcs table
      await db.query(
        'UPDATE dcs SET available_capacity = $1 WHERE id = $2',
        [value, id]
      );
    } else if (type === 'line') {
      // Update weekly_capacity in lines table
      await db.query(
        'UPDATE lines SET weekly_capacity = $1 WHERE id = $2',
        [value, id]
      );
    } else {
      return res.status(400).json({ error: 'Invalid utilization type specified. Must be \'dc\' or \'line\'.' });
    }

    res.status(200).json({ message: `${type} utilization updated successfully` });
  } catch (err) {
    console.error(`Error in /utilization/${type}/:id PUT endpoint:`, err.message, err.stack);
    res.status(500).json({ error: 'Failed to update utilization data' });
  }
});

router.post('/apply-scenario', async (req, res) => {
  try {
    const { scenario } = req.body;

    // Mock scenario application logic
    // In a real application, this would update the database based on the scenario
    console.log(`Applying scenario: ${scenario}`);

    // Simulate different changes based on scenario
    if (scenario === 'Minimize Out of Stock Risk') {
      // Logic to minimize OOS risk
      console.log('Applying Minimize Out of Stock Risk scenario');
    } else if (scenario === 'Maximize Capacity Utilization') {
      // Logic to maximize capacity
      console.log('Applying Maximize Capacity Utilization scenario');
    } else if (scenario === 'Maximize Profitability') {
      // Logic to maximize profitability
      console.log('Applying Maximize Profitability scenario');
    } else if (scenario === 'Balanced Approach') {
      // Logic for balanced approach
      console.log('Applying Balanced Approach scenario');
    }

    res.json({ message: `${scenario} applied successfully` });
  } catch (err) {
    console.error('Error in /apply-scenario endpoint:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to apply scenario' });
  }
});

module.exports = router;
