/**
 * Query utilities for pagination, sorting, and filtering
 */

/**
 * Get pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - Pagination info
 */
const getPagination = (page = 1, limit = 12) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12)); // Max 50 items per page
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    limitNum,
    skip,
  };
};

/**
 * Build sort object from query parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {object} - MongoDB sort object
 */
const buildSortObject = (sortBy = "createdAt", sortOrder = "desc") => {
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "price",
    "model",
    "brand",
    "type",
    "featured",
    "status",
    "viewCount",
    "sku",
  ];

  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder.toLowerCase() === "asc" ? 1 : -1;

  const sortObject = { [sortField]: order };

  // Secondary sort by createdAt for consistency
  if (sortField !== "createdAt") {
    sortObject.createdAt = -1;
  }

  return sortObject;
};

/**
 * Build filter object from query parameters
 * @param {object} query - Query parameters
 * @returns {object} - MongoDB filter object
 */
const buildFilterObject = (query) => {
  const filters = { isActive: true };

  // Text search
  if (query.search) {
    const searchRegex = new RegExp(
      query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    filters.$or = [
      { model: searchRegex },
      { brand: searchRegex },
      { sku: searchRegex },
      { description: searchRegex },
    ];
  }

  // Brand filter
  if (query.brand && query.brand !== "all") {
    filters.brand = query.brand;
  }

  // Type filter
  if (query.type && query.type !== "all") {
    filters.type = query.type;
  }

  // Status filter
  if (query.status && query.status !== "all") {
    filters.status = query.status;
  }

  // Featured filter
  if (query.featured !== undefined) {
    filters.featured = query.featured === "true";
  }

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      const minPrice = parseFloat(query.minPrice);
      if (!isNaN(minPrice)) filters.price.$gte = minPrice;
    }
    if (query.maxPrice) {
      const maxPrice = parseFloat(query.maxPrice);
      if (!isNaN(maxPrice)) filters.price.$lte = maxPrice;
    }
  }

  return filters;
};

/**
 * Generate aggregation pipeline for advanced queries
 * @param {object} options - Aggregation options
 * @returns {array} - MongoDB aggregation pipeline
 */
const buildAggregationPipeline = (options = {}) => {
  const pipeline = [];

  // Match stage (filtering)
  if (options.match) {
    pipeline.push({ $match: options.match });
  }

  // Lookup stage (joins)
  if (options.lookup) {
    pipeline.push({ $lookup: options.lookup });
  }

  // Sort stage
  if (options.sort) {
    pipeline.push({ $sort: options.sort });
  }

  // Pagination
  if (options.skip) {
    pipeline.push({ $skip: options.skip });
  }

  if (options.limit) {
    pipeline.push({ $limit: options.limit });
  }

  // Projection (select fields)
  if (options.project) {
    pipeline.push({ $project: options.project });
  }

  return pipeline;
};

module.exports = {
  getPagination,
  buildSortObject,
  buildFilterObject,
  buildAggregationPipeline,
};

