const express = require('express');
const db = require('../db');
const router = express.Router();

// SINGLE ROUTE: GET /api/dashboard (ALL DATA!)
router.get('/', async (req, res) => {
  try {
    console.log('🔄 Fetching dashboard data...');

    // 1. PLANNING CALENDAR
    const planning = await db.query(`
      SELECT week, status, activities, owner, due_date 
      FROM planning_calendar 
      ORDER BY due_date ASC
    `);

    // 2. DEMAND PLANS
    const demand = await db.query(`
      SELECT plan_name, status, created_date, last_modified 
      FROM demand_plans 
      ORDER BY created_date DESC
    `);

    // 3. SUPPLY PLANS
    const supply = await db.query(`
      SELECT plan_name, status, created_date, last_modified 
      FROM supply_plans 
      ORDER BY created_date DESC
    `);

    // 4. KPIs (SAMPLE - UPDATE LATER)
    const kpis = {
      forecast_accuracy: 95.5,
      bias: 2.1,
      plan_attainment: 92.3,
      oos_risk_skus: 5
    };

    const result = {
      planningCalendar: planning.rows,
      demandPlans: demand.rows,
      supplyPlans: supply.rows,
      forecastMetrics: kpis
    };

    console.log('✅ Dashboard data sent:', {
      planningCount: planning.rows.length,
      demandCount: demand.rows.length,
      supplyCount: supply.rows.length
    });

    res.json(result);

  } catch (err) {
    console.error('❌ Dashboard error:', err.message);
    // RETURN EMPTY DATA IF TABLES DON'T EXIST
    res.json({
      planningCalendar: [],
      demandPlans: [],
      supplyPlans: [],
      forecastMetrics: { forecast_accuracy: 0, bias: 0, plan_attainment: 0, oos_risk_skus: 0 }
    });
  }
});

module.exports = router;