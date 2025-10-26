import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import Breadcrumbs from './Breadcrumbs';

function DemandReview() {
  const { user } = useAuth();
  const [forecastData, setForecastData] = useState([]);
  const [allForecastData, setAllForecastData] = useState([]);
  const [segmentationData, setSegmentationData] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    skus: [],
    dcs: [],
    segments: [],
    categories: [],
    brands: [],
    packSizes: [],
    packTypes: [],
  });
  const [filters, setFilters] = useState({
    skuId: '',
    dcId: '',
    segment: '',
    category: '',
    brand: '',
    packSize: '',
    packType: '',
    startWeek: 45,
    endWeek: 52,
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedForecast, setEditedForecast] = useState('');
  const [editedReason, setEditedReason] = useState('');
  const [reasonCodes, setReasonCodes] = useState([]);

  useEffect(() => {
    const fetchAllForecastData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/demand/review`);
        if (res.data && res.data.forecast && Array.isArray(res.data.forecast)) {
          const forecastData = res.data.forecast.map(item => ({
            ...item,
            forecast_volume: parseFloat(item.forecast_volume),
            original_forecast_volume: parseFloat(item.original_forecast_volume),
            actual_volume: parseFloat(item.actual_volume),
            bias: parseFloat(item.bias),
            adjustment_volume: parseFloat(item.adjustment_volume),
          }));
          setAllForecastData(forecastData);
        } else {
          setAllForecastData([]);
        }
      } catch (error) {
        console.error('Error fetching all forecast data:', error);
        setAllForecastData([]);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const [skusRes, dcsRes, segmentsRes, categoriesRes, brandsRes, packSizesRes, packTypesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/skus`),
          axios.get(`${API_BASE_URL}/api/dcs`),
          axios.get(`${API_BASE_URL}/api/demand/segments`),
          axios.get(`${API_BASE_URL}/api/demand/categories`),
          axios.get(`${API_BASE_URL}/api/demand/brands`),
          axios.get(`${API_BASE_URL}/api/demand/pack-sizes`),
          axios.get(`${API_BASE_URL}/api/demand/pack-types`),
        ]);
        setFilterOptions({
          skus: Array.isArray(skusRes.data) ? skusRes.data : [],
          dcs: Array.isArray(dcsRes.data) ? dcsRes.data : [],
          segments: Array.isArray(segmentsRes.data) ? segmentsRes.data : [],
          categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
          brands: Array.isArray(brandsRes.data) ? brandsRes.data : [],
          packSizes: Array.isArray(packSizesRes.data) ? packSizesRes.data : [],
          packTypes: Array.isArray(packTypesRes.data) ? packTypesRes.data : [],
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setFilterOptions({
          skus: [],
          dcs: [],
          segments: [],
          categories: [],
          brands: [],
          packSizes: [],
          packTypes: [],
        });
      }
    };
    const fetchReasonCodes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reason-codes`);
        setReasonCodes(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching reason codes:', error);
        setReasonCodes([]);
      }
    };

    fetchAllForecastData();
    fetchFilterOptions();
    fetchReasonCodes();
  }, []);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const params = {
          ...filters,
          startWeek: filters.startWeek || 45,
          endWeek: filters.endWeek || 52,
        };
        const res = await axios.get(`${API_BASE_URL}/api/demand/review`, { params });
        if (res.data && res.data.forecast && Array.isArray(res.data.forecast)) {
          const forecastData = res.data.forecast.map(item => ({
            ...item,
            forecast_volume: parseFloat(item.forecast_volume) || 0,
            original_forecast_volume: parseFloat(item.original_forecast_volume) || 0,
            actual_volume: parseFloat(item.actual_volume) || 0,
            bias: parseFloat(item.bias) || 0,
            adjustment_volume: parseFloat(item.adjustment_volume) || 0,
          }));
          setForecastData(forecastData);
        } else {
          setForecastData([]);
        }
        if (res.data && res.data.segmentation && typeof res.data.segmentation === 'object') {
          setSegmentationData(res.data.segmentation);
        } else {
          setSegmentationData({});
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        setForecastData([]);
        setSegmentationData({});
      }
    };
    fetchForecastData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      skuId: '',
      dcId: '',
      segment: '',
      category: '',
      brand: '',
      packSize: '',
      packType: '',
      startWeek: 45,
      endWeek: 52,
    };
    setFilters(clearedFilters);
  };

  const handleEditRow = (row) => {
    setEditingRowId(row.id);
    setEditedForecast(row.forecast_volume.toString());
    setEditedReason(row.adjustment_reason || '');
  };

  const handleSaveRow = async (forecastId) => {
    const newForecast = parseFloat(editedForecast);
    if (isNaN(newForecast)) {
      alert('Please enter a valid forecast volume.');
      return;
    }

    if (!editedReason.trim()) {
      alert('Reason is required.');
      return;
    }

    const originalRow = forecastData.find(r => r.id === forecastId);
    const adjustment_volume = newForecast - originalRow.original_forecast_volume;

    try {
      await axios.put(`${API_BASE_URL}/api/demand/forecast/${forecastId}`, {
        adjustment_volume,
        reason_code: editedReason,
        userId: user.id,
      });
      setFilters({ ...filters });
      setEditingRowId(null);
      setEditedForecast('');
      setEditedReason('');
    } catch (error) {
      console.error('Error updating forecast:', error);
      alert('Failed to update forecast.');
    }
  };

  const demandByCategoryData = allForecastData.reduce((acc, item) => {
    const week = `Week ${item.week}`;
    const category = item.category;
    if (!acc[week]) {
      acc[week] = { name: week };
    }
    if (!acc[week][category]) {
      acc[week][category] = 0;
    }
    acc[week][category] += item.forecast_volume;
    return acc;
  }, {});

  const demandByCategoryArray = Object.values(demandByCategoryData);
  const uniqueCategories = [...new Set(allForecastData.map(item => item.category))];

  return (
    <Box sx={{ p: 3, paddingTop: '0px' }}>
      <Breadcrumbs />
      {/* Segmentation KPI Cards - COMMENTED OUT */}
      {/*
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {Object.entries(segmentationData).map(([seg, { count, volume, service }]) => (
          <Grid item xs={3} key={seg}>
            <Card sx={{ backgroundColor: 'white', width: '300px', height: '150px' }}>
              <CardContent>
                <Typography variant="h6">Segment {seg}</Typography>
                <Typography>{count} SKUs </Typography>
                {seg === 'D' ? <WarningIcon color="warning" /> : <CheckCircleIcon color="success" />}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      */}

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Demand by Category</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={demandByCategoryArray}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {uniqueCategories.map((category, index) => (
              <Bar key={category} dataKey={category} stackId="a" fill={`hsl(${index * 137}, 70%, 50%)`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {/* SKU Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="sku-label" shrink={true} sx={{ color: 'black' }}>SKU</InputLabel>
              <Select
                displayEmpty // Ensures clean empty state
                labelId="sku-label"
                name="skuId"
                value={filters.skuId}
                label="SKU"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }} // Selected value in black
              >
                <MenuItem value=""></MenuItem>
                {filterOptions.skus.length > 0 ? (
                  filterOptions.skus.map(sku => (
                    <MenuItem key={sku.id} value={sku.id}>{sku.name}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* DC Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="dc-label" shrink={true} sx={{ color: 'black' }}>DC</InputLabel>
              <Select
                displayEmpty
                labelId="dc-label"
                name="dcId"
                value={filters.dcId}
                label="DC"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.dcs.length > 0 ? (
                  filterOptions.dcs.map(dc => (
                    <MenuItem key={dc.id} value={dc.id}>{dc.name}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="category-label" shrink={true} sx={{ color: 'black' }}>Category</InputLabel>
              <Select
                displayEmpty
                labelId="category-label"
                name="category"
                value={filters.category}
                label="Category"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.categories.length > 0 ? (
                  filterOptions.categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Brand Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="brand-label" shrink={true} sx={{ color: 'black' }}>Brand</InputLabel>
              <Select
                displayEmpty
                labelId="brand-label"
                name="brand"
                value={filters.brand}
                label="Brand"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.brands.length > 0 ? (
                  filterOptions.brands.map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Segment Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="segment-label" shrink={true} sx={{ color: 'black' }}>Segment</InputLabel>
              <Select
                displayEmpty
                labelId="segment-label"
                name="segment"
                value={filters.segment}
                label="Segment"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.segments.length > 0 ? (
                  filterOptions.segments.map(segment => (
                    <MenuItem key={segment} value={segment}>{segment}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Pack Size Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="packSize-label" shrink={true} sx={{ color: 'black' }}>Pack Size</InputLabel>
              <Select
                displayEmpty
                labelId="packSize-label"
                name="packSize"
                value={filters.packSize}
                label="Pack Size"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.packSizes.length > 0 ? (
                  filterOptions.packSizes.map(packSize => (
                    <MenuItem key={packSize} value={packSize}>{packSize}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Pack Type Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="packType-label" shrink={true} sx={{ color: 'black' }}>Pack Type</InputLabel>
              <Select
                displayEmpty
                labelId="packType-label"
                name="packType"
                value={filters.packType}
                label="Pack Type"
                onChange={handleFilterChange}
                sx={{ minWidth: 200, color: 'black' }}
              >
                {filterOptions.packTypes.length > 0 ? (
                  filterOptions.packTypes.map(packType => (
                    <MenuItem key={packType} value={packType}>{packType}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Week */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Start Week"
              name="startWeek"
              type="number"
              value={filters.startWeek}
              onChange={handleFilterChange}
              variant="outlined"
              size="medium"
              sx={{ minWidth: 200 }}
              InputLabelProps={{ shrink: true, sx: { color: 'black' } }}
              InputProps={{ sx: { color: 'black' } }} // Value in black
            />
          </Grid>

          {/* End Week */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="End Week"
              name="endWeek"
              type="number"
              value={filters.endWeek}
              onChange={handleFilterChange}
              variant="outlined"
              size="medium"
              sx={{ minWidth: 200 }}
              InputLabelProps={{ shrink: true, sx: { color: 'black' } }}
              InputProps={{ sx: { color: 'black' } }}
            />
          </Grid>

          {/* Clear Button Only */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button onClick={handleClearFilters} variant="outlined" size="medium">
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Detailed Forecast</Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'white' }}>
                <TableCell>SKU</TableCell>
                <TableCell>DC</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Pack Size</TableCell>
                <TableCell>Pack Type</TableCell>
                <TableCell>Week</TableCell>
                <TableCell>Forecast Volume</TableCell>
                <TableCell>Actual Volume</TableCell>
                <TableCell>Bias</TableCell>
                <TableCell>Model Type</TableCell>
                <TableCell>Adjustment</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forecastData.map((row, index) => (
                <TableRow key={`${row.sku_id}-${row.dc_id}-${row.week}`}>
                  <TableCell>{row.sku_name}</TableCell>
                  <TableCell>{row.dc_name}</TableCell>
                  <TableCell>{row.segment}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.brand}</TableCell>
                  <TableCell>{row.pack_size}</TableCell>
                  <TableCell>{row.pack_type}</TableCell>
                  <TableCell>{row.week}</TableCell>
                  <TableCell>
                    {editingRowId === row.id ? (
                      <TextField
                        value={editedForecast}
                        onChange={(e) => setEditedForecast(e.target.value)}
                        size="small"
                        autoFocus
                      />
                    ) : (
                      row.forecast_volume
                    )}
                  </TableCell>
                  <TableCell>{row.actual_volume}</TableCell>
                  <TableCell>{row.bias}</TableCell>
                  <TableCell>{row.model_type}</TableCell>
                  <TableCell>{row.adjustment_volume}</TableCell>
                  <TableCell>
                    {editingRowId === row.id ? (
                      <Autocomplete
                        freeSolo
                        options={reasonCodes.filter(code => code && code.reason).map((code) => code.reason)}
                        value={editedReason}
                        onChange={(event, newValue) => setEditedReason(newValue || '')}
                        onInputChange={(event, newInputValue) => setEditedReason(newInputValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ minWidth: 150 }}
                            placeholder="Select or type new reason"
                          />
                        )}
                        autoFocus
                      />
                    ) : (
                      row.adjustment_reason
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRowId === row.id ? (
                      <Button
                        onClick={() => handleSaveRow(row.id)}
                        size="small"
                        variant="contained"
                        sx={{ mr: 1, backgroundColor: '#C8102E', color: '#FFFFFF', '&:hover': { backgroundColor: '#A00' } }}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEditRow(row)}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, borderColor: '#C8102E', color: '#C8102E', '&:hover': { backgroundColor: '#C8102E', color: '#FFFFFF' } }}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default DemandReview;