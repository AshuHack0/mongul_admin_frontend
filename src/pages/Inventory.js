import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  Search, 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  Inventory as InventoryIcon,
  Warning,
  CheckCircle,
  Cancel,
  LocalShipping,
  Category,
  AttachMoney
} from '@mui/icons-material';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 'PROD-001',
      name: 'Wireless Headphones',
      category: 'Electronics',
      sku: 'WH-001',
      stock: 45,
      minStock: 10,
      price: 89.99,
      status: 'in-stock',
      image: '🎧'
    },
    {
      id: 'PROD-002',
      name: 'Smartphone Case',
      category: 'Accessories',
      sku: 'SC-002',
      stock: 8,
      minStock: 15,
      price: 24.99,
      status: 'low-stock',
      image: '📱'
    },
    {
      id: 'PROD-003',
      name: 'Laptop Stand',
      category: 'Office',
      sku: 'LS-003',
      stock: 0,
      minStock: 5,
      price: 39.99,
      status: 'out-of-stock',
      image: '💻'
    },
    {
      id: 'PROD-004',
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      sku: 'BS-004',
      stock: 23,
      minStock: 8,
      price: 129.99,
      status: 'in-stock',
      image: '🔊'
    },
    {
      id: 'PROD-005',
      name: 'USB Cable',
      category: 'Accessories',
      sku: 'UC-005',
      stock: 156,
      minStock: 20,
      price: 12.99,
      status: 'in-stock',
      image: '🔌'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'success';
      case 'low-stock': return 'warning';
      case 'out-of-stock': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckCircle />;
      case 'low-stock': return <Warning />;
      case 'out-of-stock': return <Cancel />;
      default: return <InventoryIcon />;
    }
  };

  const getStockPercentage = (stock, minStock) => {
    return Math.min((stock / minStock) * 100, 100);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.status === 'in-stock').length;
  const lowStockProducts = products.filter(p => p.status === 'low-stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock').length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Inventory Management
        </Typography>
        <Button 
          variant="contained" 
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
          startIcon={<Add />}
        >
          Add Product
        </Button>
      </Box>

      {/* Inventory Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#4caf50' }}>
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {totalProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#4caf50' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {inStockProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    In Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#ff9800' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {lowStockProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Low Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: '#f44336' }}>
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {outOfStockProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Out of Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockProducts > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Low Stock Alert:</strong> {lowStockProducts} products are running low on stock. 
          Consider reordering soon.
        </Alert>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<Category />}>
                  Categories
                </Button>
                <Button variant="outlined" startIcon={<LocalShipping />}>
                  Reorder
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ background: '#667eea', fontSize: '1.2rem' }}>
                          {product.image}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {product.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.stock}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            min: {product.minStock}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getStockPercentage(product.stock, product.minStock)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: product.status === 'in-stock' ? '#4caf50' :
                                         product.status === 'low-stock' ? '#ff9800' : '#f44336',
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${product.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(product.status)}
                        label={product.status.replace('-', ' ')}
                        color={getStatusColor(product.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Inventory; 