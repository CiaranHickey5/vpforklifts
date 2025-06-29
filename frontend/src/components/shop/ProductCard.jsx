import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  IconButton,
  Avatar,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Star,
  ElectricBolt,
  LocalShipping,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const ProductCard = ({ forklift }) => {
  const theme = useTheme();
  const {
    setSelectedForklift,
    isAuthenticated,
    setEditingForklift,
    setIsEditing,
    setCurrentPage,
    setDeleteId,
    setShowDeleteConfirm,
  } = useApp();

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
        },
        position: 'relative',
        overflow: 'visible',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedForklift(forklift)}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={forklift.image}
          alt={forklift.model}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />

        {/* Status Badge */}
        <Chip
          label={forklift.status}
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 'bold',
          }}
        />

        {/* Featured Badge */}
        {forklift.featured && (
          <Avatar
            sx={{
              bgcolor: 'warning.main',
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
            }}
          >
            <Star sx={{ fontSize: 18, color: 'white' }} />
          </Avatar>
        )}

        {/* Hover Overlay */}
        <Fade in={isHovered} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedForklift(forklift);
              }}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                color: 'primary.main',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              Quick View
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Brand and Type Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={forklift.brand} 
            color="primary" 
            size="small" 
            variant="outlined"
          />
          <Chip
            icon={<ElectricBolt />}
            label={forklift.type}
            color="secondary"
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            minHeight: '3rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {forklift.model}
        </Typography>

        {/* SKU */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          SKU: {forklift.sku}
        </Typography>

        {/* Specifications */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Capacity
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {forklift.capacity}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Lift Height
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {forklift.lift}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Pricing */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {forklift.priceFormatted}
            </Typography>
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              €{Math.round(forklift.price * 1.2).toLocaleString()}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 'medium' }}>
              or hire from
            </Typography>
            <Chip
              icon={<LocalShipping />}
              label={forklift.hirePrice}
              color="secondary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Visibility />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedForklift(forklift);
            }}
          >
            View Details
          </Button>

          {/* Admin Actions */}
          {isAuthenticated && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Edit />}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingForklift(forklift);
                  setIsEditing(true);
                  setCurrentPage('admin-edit');
                }}
                sx={{ flex: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(forklift.id);
                  setShowDeleteConfirm(true);
                }}
                sx={{ flex: 1 }}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProductCard;