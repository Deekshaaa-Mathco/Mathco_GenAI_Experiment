import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  Box,
  Paper,
  TextField,
  CircularProgress,
  TableContainer,
  Tabs,
  Tab,
} from '@mui/material';
import Breadcrumbs from './Breadcrumbs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SupplyPlanning() {
  const [data, setData] = useState({
    dcUtilization: [],
    lineUtilization: [],
    plantLineSummary: [],
    forecastActualSales: [],
    plantAllocation: [],
    plantDcAllocation: [],
  });
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/supply/planning');
        setData(res.data || {});
      } catch (err) {
        console.error('API Error:', err);
        alert('Failed to load data. Check console.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyScenario = async (scenarioName) => {
    try {
      await axios.post('/api/supply/apply-scenario', { scenario: scenarioName });
      // Refresh data after applying scenario
      const res = await axios.get('/api/supply/planning');
      setData(res.data || {});
      alert(`${scenarioName} applied successfully!`);
    } catch (error) {
      console.error('Error applying scenario:', error);
      alert('Failed to apply scenario. Check console.');
    }
  };

  const handleCellEdit = (type, id, field, value) => {
    setEditingCell({ type, id, field });
    setEditedValue(String(value ?? '0'));
  };

  const handleSaveEdit = async () => {
    if (!editingCell) return;
    const { type, id, field } = editingCell;

    if (field === 'utilization_percentage') {
      const newPercentage = parseFloat(editedValue);
      if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
        alert('Please enter a valid percentage (0–100).');
        return;
      }

      let row;
      let newCapacity = 0;

      if (type === 'dc') {
        row = data.dcUtilization.find((r) => r.id === id);
        if (!row) return alert('Row not found.');
        const maxCap = parseFloat(row.max_capacity) || 0;
        newCapacity = Math.round(maxCap * (newPercentage / 100));
      } else if (type === 'line') {
        row = data.lineUtilization.find((r) => r.id === id);
        if (!row) return alert('Row not found.');
        if (newPercentage >= 100) {
          alert('Utilization cannot be 100% or more due to changeover time.');
          return;
        }
        if (1 - newPercentage / 100 === 0) {
          alert('Invalid percentage causes division by zero.');
          return;
        }
        const changeover = parseFloat(row.changeover_time) || 0;
        newCapacity = Math.round(changeover / (1 - newPercentage / 100));
      } else {
        return;
      }

      try {
        await axios.put(`/supply/utilization/${type}/${id}`, {
          value: newCapacity,
        });
        const res = await axios.get('/api/supply/planning');
        setData(res.data || {});
        setEditingCell(null);
        setEditedValue('');
      } catch (error) {
        console.error('Error updating:', error);
        alert('Failed to update. Check console.');
      }
    }
  };

  const chartData = (data.forecastActualSales || []).map((item) => ({
    week: `Week ${item.week || ''}`,
    Forecast: parseFloat(item.total_forecast_volume) || 0,
    Actual: parseFloat(item.total_actual_volume) || 0,
  }));

  const renderTable = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
              DC Utilization
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ mt: 2, border: '1px solid #ddd', borderRadius: '10px' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ color: 'white' }}>DC Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Max Capacity</TableCell>
                    <TableCell sx={{ color: 'white' }}>Available Capacity</TableCell>
                    <TableCell sx={{ color: 'white' }}>Utilization %</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.dcUtilization || []).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ color: 'black' }}>{row.name || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'black' }}>
                        {(parseFloat(row.max_capacity) || 0).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: 'black' }}>
                        {(parseFloat(row.available_capacity) || 0).toLocaleString()}
                      </TableCell>
                      <TableCell
                        onDoubleClick={() =>
                          handleCellEdit(
                            'dc',
                            row.id,
                            'utilization_percentage',
                            Number(row.utilization_percentage || 0).toFixed(1)
                          )
                        }
                        sx={{ color: 'black', cursor: 'pointer' }}
                      >
                        {editingCell?.type === 'dc' &&
                        editingCell?.id === row.id &&
                        editingCell?.field === 'utilization_percentage' ? (
                          <TextField
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            autoFocus
                            size="small"
                            type="number"
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                        ) : (
                          `${Number(row.utilization_percentage || 0).toFixed(1)}%`
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => alert(`Viewing details for DC: ${row.name}\nMax Capacity: ${row.max_capacity}\nAvailable Capacity: ${row.available_capacity}\nUtilization: ${row.utilization_percentage}%`)}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: '#FFFFFF' } }}
                        >
                          View
                        </Button>
                        {editingCell?.type === 'dc' &&
                          editingCell?.id === row.id &&
                          editingCell?.field === 'utilization_percentage' && (
                            <Button
                              onClick={handleSaveEdit}
                              size="small"
                              variant="contained"
                              sx={{ backgroundColor: '#C8102E', color: '#FFFFFF' }}
                            >
                              Save
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
              Plant Line Utilization
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ mt: 2, border: '1px solid #ddd', borderRadius: '10px' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ color: 'white' }}>Plant</TableCell>
                    <TableCell sx={{ color: 'white' }}>Line</TableCell>
                    <TableCell sx={{ color: 'white' }}>Weekly Capacity</TableCell>
                    <TableCell sx={{ color: 'white' }}>Changeover Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Utilization %</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.lineUtilization || []).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ color: 'black' }}>{row.plant_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.line_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>
                        {(parseFloat(row.weekly_capacity) || 0).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: 'black' }}>
                        {parseFloat(row.changeover_time) || 0}
                      </TableCell>
                      <TableCell
                        onDoubleClick={() =>
                          handleCellEdit(
                            'line',
                            row.id,
                            'utilization_percentage',
                            Number(row.utilization_percentage || 0).toFixed(1)
                          )
                        }
                        sx={{ color: 'black', cursor: 'pointer' }}
                      >
                        {editingCell?.type === 'line' &&
                        editingCell?.id === row.id &&
                        editingCell?.field === 'utilization_percentage' ? (
                          <TextField
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            autoFocus
                            size="small"
                            type="number"
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                        ) : (
                          `${Number(row.utilization_percentage || 0).toFixed(1)}%`
                        )}
                      </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => alert(`Viewing details for Line: ${row.line_name}\nPlant: ${row.plant_name}\nWeekly Capacity: ${row.weekly_capacity}\nChangeover Time: ${row.changeover_time}\nUtilization: ${row.utilization_percentage}%`)}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: '#FFFFFF' } }}
                    >
                      View
                    </Button>
                    {editingCell?.type === 'line' &&
                      editingCell?.id === row.id &&
                      editingCell?.field === 'utilization_percentage' && (
                        <Button
                          onClick={handleSaveEdit}
                          size="small"
                          variant="contained"
                          sx={{ backgroundColor: '#C8102E', color: '#FFFFFF' }}
                        >
                          Save
                        </Button>
                      )}
                  </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
              Plant Line Summary
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ color: 'white' }}>Plant Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Number of Lines</TableCell>
                    <TableCell sx={{ color: 'white' }}>Total Weekly Capacity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.plantLineSummary || []).map((row) => (
                    <TableRow key={row.plant_id}>
                      <TableCell sx={{ color: 'black' }}>{row.plant_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.number_of_lines}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.total_weekly_capacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 3:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
              Plant Allocation
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ color: 'white' }}>Plant Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Allocated Capacity</TableCell>
                    <TableCell sx={{ color: 'white' }}>Total Capacity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.plantAllocation || []).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: 'black' }}>{row.plant_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.allocated_capacity}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.total_capacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      case 4:
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: 'black' }}>
              Plant DC Allocation
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'black' }}>
                    <TableCell sx={{ color: 'white' }}>Plant Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>DC Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Allocated Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data.plantDcAllocation || []).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: 'black' }}>{row.plant_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.dc_name}</TableCell>
                      <TableCell sx={{ color: 'black' }}>{row.allocated_volume}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs />
      <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
        Supply Planning
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            name: 'Minimize Out of Stock Risk',
            kpis: 'OOS Risk Reduction -45%, Capacity Impact 89%, Service Level 97.2%',
            changes: [
              '✓ Increased priority for Coke Zero 500ml',
              '✓ Shifted Coke Zero 2L to Mumbai',
              '✓ Reduced stock for low-priority SKUs',
              '! 3 SKUs need expedited transport'
            ],
            impact: 'Production Schedule Impact: Line 1 87% to 92%, 2 SKUs off-peak'
          },
          {
            name: 'Maximize Capacity Utilization',
            kpis: 'OOS Risk Reduction -30%, Capacity Impact 95%, Service Level 96.5%',
            changes: [
              '✓ Optimized line utilization across plants',
              '✓ Shifted production to high-capacity lines',
              '✓ Reduced changeover times',
              '! 2 SKUs need expedited transport'
            ],
            impact: 'Production Schedule Impact: Line 2 85% to 95%, 1 SKU off-peak'
          },
          {
            name: 'Maximize Profitability',
            kpis: 'OOS Risk Reduction -20%, Capacity Impact 80%, Service Level 98.0%',
            changes: [
              '✓ Prioritized high-margin SKUs',
              '✓ Reduced production for low-margin items',
              '✓ Optimized DC allocation for cost savings',
              '! 1 SKU needs expedited transport'
            ],
            impact: 'Production Schedule Impact: Line 3 90% to 88%, 3 SKUs off-peak'
          },
          {
            name: 'Balanced Approach',
            kpis: 'OOS Risk Reduction -35%, Capacity Impact 87%, Service Level 97.5%',
            changes: [
              '✓ Balanced priority across SKUs',
              '✓ Moderate capacity utilization',
              '✓ Optimized for both risk and profit',
              '! 2 SKUs need expedited transport'
            ],
            impact: 'Production Schedule Impact: Line 1 88% to 90%, 2 SKUs off-peak'
          }
        ].map((scenario, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ backgroundColor: '#f5f5f5', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'black', mb: 1 }}>
                  {scenario.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                  {scenario.kpis}
                </Typography>
                <Typography variant="body2" sx={{ color: 'black', mt: 1, fontSize: '0.8rem' }}>
                  {scenario.impact}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#C8102E', color: 'white', '&:hover': { backgroundColor: '#a50f23' } }}
                    onClick={() => applyScenario(scenario.name)}
                  >
                    Apply Scenario
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: 'white' } }}
                    onClick={() => window.location.href = '/publish-plan'}
                  >
                    Publish Plan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      }</Grid>
      {/* Forecast vs Actual Sales */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
          Forecast vs Actual Sales
        </Typography>
        {chartData.length === 0 ? (
          <Typography>No data available</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Forecast" stroke="#C8102E" />
              <Line type="monotone" dataKey="Actual" stroke="#000000" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': { color: 'black', textTransform: 'none', fontWeight: 500 },
            '& .Mui-selected': { color: '#C8102E !important', fontWeight: 600 },
          }}
        >
          <Tab label="DC Utilization" />
          <Tab label="Plant Line Utilization" />
          <Tab label="Plant Line Summary" />
          <Tab label="Plant Allocation" />
          <Tab label="Plant DC Allocation" />
        </Tabs>
      </Box>

      {/* Render Selected Table */}
      {renderTable()}
    </Box>
  );
}

export default SupplyPlanning;
