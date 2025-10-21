require('dotenv').config(); // Ensure this is at the top
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db'); // Imported but not used directly here
const app = express();
const port = 3001;

app.use(cors({
  origin: ['https://mathco-gen-ai-experiment-6ld6.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/demand', require('./routes/demand'));
app.use('/api/supply', require('./routes/supply'));
app.use('/api/model', require('./routes/model'));
app.use('/api/scenarios', require('./routes/scenarios'));
app.use('/api/mrp', require('./routes/mrp'));
app.use('/api/constraints', require('./routes/constraints'));
app.use('/api/commercial', require('./routes/commercial'));
app.use('/api/skus', require('./routes/skus'));
app.use('/api/dcs', require('./routes/dcs'));
app.use('/api/reason-codes', require('./routes/reason_codes'));
app.use('/api/plant-line-mapping', require('./routes/plant_line_mapping'));
app.use('/api/plant-dc-mapping', require('./routes/plant_dc_mapping'));
app.use('/api/line-downtime-constraints', require('./routes/line_downtime_constraints'));
app.use('/api/plant-priority', require('./routes/plant_priority'));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Root route
app.get('/', (req, res) => res.send('Coca-Cola Supply Planning Backend'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Export for Vercel
module.exports = app;

// Start server (only if not in Vercel environment)
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
