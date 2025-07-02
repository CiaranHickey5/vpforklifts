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
  Avatar,
  Fade,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Star,
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
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
        },
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedForklift(forklift)}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={forklift.image}
          alt={forklift.model}
          sx={{
            objectFit: 'cover',
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

        {/* Featured Star */}
        {forklift.featured && (
          <Avatar
            sx={{
              bgcolor: 'warning.main',
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              boxShadow: theme.shadows[2],
            }}
          >
            <Star sx={{ fontSize: 18, color: 'white' }} />
          </Avatar>
        )}

        {/* Quick View Overlay */}
        <Fade in={isHovered} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              p: 1,
              textAlign: 'center',
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedForklift(forklift);
              }}
            >
              Quick View
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Brand / Type */}
        <Stack direction="row" spacing={1} mb={2}>
          <Chip label={forklift.brand} variant="outlined" size="small" />
          <Chip
            label={forklift.type}
            color="primary"
            size="small"
            variant="filled"
          />
        </Stack>

        {/* Model */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {forklift.model}
        </Typography>

        {/* SKU */}
        <Typography variant="caption" color="text.secondary" mb={2}>
          SKU: {forklift.sku}
        </Typography>

        {/* Specs */}
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Capacity
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {forklift.capacity}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Lift Height
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {forklift.lift}
            </Typography>
          </Box>
        </Stack>

        {/* Pricing */}
        <Stack spacing={1} mb={2}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
            >
              {forklift.priceFormatted}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              €{Math.round(forklift.price * 1.2).toLocaleString()}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            Or hire from €{forklift.hirePrice} / week
          </Typography>
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedForklift(forklift);
          }}
        >
          View Details
        </Button>

        {isAuthenticated && (
          <Stack direction="row" spacing={1} sx={{ width: '100%', mt: 1 }}>
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
                setDeleteId(forklift._id);
                setShowDeleteConfirm(true);
              }}
              sx={{ flex: 1 }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
