const express = require("express");
const { Forklift } = require("../models/Forklift");
const { auth, checkPermission } = require("../middleware/auth");
const { validateInput, sanitizeInput } = require("../utils/validation");
const { getPagination, buildSortObject } = require("../utils/query");

const router = express.Router();

// @route   GET /api/forklifts
// @desc    Get all forklifts (with filtering, sorting, pagination)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      brand,
      type,
      status,
      featured,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filters = { isActive: true };

    if (brand && brand !== "all") filters.brand = brand;
    if (type && type !== "all") filters.type = type;
    if (status && status !== "all") filters.status = status;
    if (featured !== undefined) filters.featured = featured === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    let query = Forklift.find(filters);

    if (search) {
      const searchRegex = new RegExp(sanitizeInput(search), "i");
      filters.$or = [
        { model: searchRegex },
        { brand: searchRegex },
        { sku: searchRegex },
        { description: searchRegex },
      ];
    }

    // Apply filters
    query = Forklift.find(filters);

    // Sorting
    const sortObject = buildSortObject(sortBy, sortOrder);
    query = query.sort(sortObject);

    // Pagination
    const { skip, limitNum } = getPagination(page, limit);

    // Execute query with pagination
    const [forklifts, totalCount] = await Promise.all([
      query.skip(skip).limit(limitNum).lean(),
      Forklift.countDocuments(filters),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        forklifts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum,
        },
        filters: {
          search: search || null,
          brand: brand || null,
          type: type || null,
          status: status || null,
          featured: featured || null,
          priceRange: {
            min: minPrice || null,
            max: maxPrice || null,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get forklifts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch forklifts",
    });
  }
});

// @route   GET /api/forklifts/featured
// @desc    Get featured forklifts
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const forklifts = await Forklift.findFeatured()
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: { forklifts },
    });
  } catch (error) {
    console.error("Get featured forklifts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured forklifts",
    });
  }
});

// @route   GET /api/forklifts/stats
// @desc    Get forklift statistics
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const [totalCount, featuredCount, brandStats, typeStats, statusStats] =
      await Promise.all([
        Forklift.countDocuments({ isActive: true }),
        Forklift.countDocuments({ isActive: true, featured: true }),
        Forklift.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$brand", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Forklift.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$type", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Forklift.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        total: totalCount,
        featured: featuredCount,
        byBrand: brandStats,
        byType: typeStats,
        byStatus: statusStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

// @route   GET /api/forklifts/:id
// @desc    Get single forklift by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid forklift ID format",
      });
    }

    const forklift = await Forklift.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!forklift) {
      return res.status(404).json({
        success: false,
        message: "Forklift not found",
      });
    }

    // Increment view count (fire and forget)
    Forklift.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    res.json({
      success: true,
      data: { forklift },
    });
  } catch (error) {
    console.error("Get forklift error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch forklift",
    });
  }
});

// @route   POST /api/forklifts
// @desc    Create new forklift
// @access  Private (Admin only)
router.post(
  "/",
  auth,
  checkPermission("forklifts", "create"),
  async (req, res) => {
    try {
      const forkliftData = req.body;

      // Validate required fields
      const requiredFields = [
        "sku",
        "brand",
        "model",
        "type",
        "capacity",
        "lift",
        "price",
        "hirePrice",
        "description",
      ];
      const missingFields = requiredFields.filter(
        (field) => !forkliftData[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Sanitize input data
      const sanitizedData = {
        sku: sanitizeInput(forkliftData.sku),
        brand: sanitizeInput(forkliftData.brand),
        model: sanitizeInput(forkliftData.model),
        type: sanitizeInput(forkliftData.type),
        capacity: sanitizeInput(forkliftData.capacity),
        lift: sanitizeInput(forkliftData.lift),
        price: parseFloat(forkliftData.price),
        hirePrice: sanitizeInput(forkliftData.hirePrice),
        description: sanitizeInput(forkliftData.description),
        image: sanitizeInput(forkliftData.image || ""),
        status: forkliftData.status || "In Stock",
        featured: Boolean(forkliftData.featured),
        features: Array.isArray(forkliftData.features)
          ? forkliftData.features
              .map((f) => sanitizeInput(f))
              .filter((f) => f.length > 0)
          : [],
        specs: forkliftData.specs || {},
        createdBy: req.user._id,
      };

      // Validate price
      if (isNaN(sanitizedData.price) || sanitizedData.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
        });
      }

      // Sanitize specs object
      if (sanitizedData.specs && typeof sanitizedData.specs === "object") {
        const sanitizedSpecs = {};
        for (let [key, value] of Object.entries(sanitizedData.specs)) {
          if (
            key &&
            value &&
            typeof key === "string" &&
            typeof value === "string"
          ) {
            sanitizedSpecs[sanitizeInput(key)] = sanitizeInput(value);
          }
        }
        sanitizedData.specs = sanitizedSpecs;
      }

      // Check if SKU already exists
      const existingForklift = await Forklift.findOne({
        sku: sanitizedData.sku,
        isActive: true,
      });

      if (existingForklift) {
        return res.status(400).json({
          success: false,
          message: "A forklift with this SKU already exists",
        });
      }

      // Create forklift
      const forklift = new Forklift(sanitizedData);
      await forklift.save();

      res.status(201).json({
        success: true,
        message: "Forklift created successfully",
        data: { forklift },
      });
    } catch (error) {
      console.error("Create forklift error:", error);

      if (error.name === "ValidationError") {
        const errorMessages = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errorMessages,
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "A forklift with this SKU already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create forklift",
      });
    }
  }
);

// @route   PUT /api/forklifts/:id
// @desc    Update forklift
// @access  Private (Admin only)
router.put(
  "/:id",
  auth,
  checkPermission("forklifts", "update"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid forklift ID format",
        });
      }

      // Find forklift
      const forklift = await Forklift.findOne({ _id: id, isActive: true });

      if (!forklift) {
        return res.status(404).json({
          success: false,
          message: "Forklift not found",
        });
      }

      // Sanitize and validate update data
      const allowedFields = [
        "sku",
        "brand",
        "model",
        "type",
        "capacity",
        "lift",
        "price",
        "hirePrice",
        "description",
        "image",
        "status",
        "featured",
        "features",
        "specs",
      ];

      const sanitizedUpdate = {};

      for (let field of allowedFields) {
        if (updateData[field] !== undefined) {
          switch (field) {
            case "price":
              const price = parseFloat(updateData[field]);
              if (isNaN(price) || price < 0) {
                return res.status(400).json({
                  success: false,
                  message: "Price must be a valid positive number",
                });
              }
              sanitizedUpdate[field] = price;
              break;

            case "featured":
              sanitizedUpdate[field] = Boolean(updateData[field]);
              break;

            case "features":
              if (Array.isArray(updateData[field])) {
                sanitizedUpdate[field] = updateData[field]
                  .map((f) => sanitizeInput(f))
                  .filter((f) => f.length > 0);
              }
              break;

            case "specs":
              if (updateData[field] && typeof updateData[field] === "object") {
                const sanitizedSpecs = {};
                for (let [key, value] of Object.entries(updateData[field])) {
                  if (
                    key &&
                    value &&
                    typeof key === "string" &&
                    typeof value === "string"
                  ) {
                    sanitizedSpecs[sanitizeInput(key)] = sanitizeInput(value);
                  }
                }
                sanitizedUpdate[field] = sanitizedSpecs;
              }
              break;

            default:
              sanitizedUpdate[field] = sanitizeInput(updateData[field]);
          }
        }
      }

      // Check if SKU is being updated and if it conflicts
      if (sanitizedUpdate.sku && sanitizedUpdate.sku !== forklift.sku) {
        const existingForklift = await Forklift.findOne({
          sku: sanitizedUpdate.sku,
          isActive: true,
          _id: { $ne: id },
        });

        if (existingForklift) {
          return res.status(400).json({
            success: false,
            message: "A forklift with this SKU already exists",
          });
        }
      }

      // Add update metadata
      sanitizedUpdate.updatedBy = req.user._id;

      // Update forklift
      const updatedForklift = await Forklift.findByIdAndUpdate(
        id,
        sanitizedUpdate,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Forklift updated successfully",
        data: { forklift: updatedForklift },
      });
    } catch (error) {
      console.error("Update forklift error:", error);

      if (error.name === "ValidationError") {
        const errorMessages = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errorMessages,
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "A forklift with this SKU already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update forklift",
      });
    }
  }
);

// @route   DELETE /api/forklifts/:id
// @desc    Delete forklift (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  auth,
  checkPermission("forklifts", "delete"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid forklift ID format",
        });
      }

      // Find and soft delete forklift
      const forklift = await Forklift.findOne({ _id: id, isActive: true });

      if (!forklift) {
        return res.status(404).json({
          success: false,
          message: "Forklift not found",
        });
      }

      // Soft delete
      forklift.isActive = false;
      forklift.updatedBy = req.user._id;
      await forklift.save();

      res.json({
        success: true,
        message: "Forklift deleted successfully",
      });
    } catch (error) {
      console.error("Delete forklift error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete forklift",
      });
    }
  }
);

// @route   POST /api/forklifts/:id/restore
// @desc    Restore soft-deleted forklift
// @access  Private (Admin only)
router.post(
  "/:id/restore",
  auth,
  checkPermission("forklifts", "update"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid forklift ID format",
        });
      }

      // Find and restore forklift
      const forklift = await Forklift.findOne({ _id: id, isActive: false });

      if (!forklift) {
        return res.status(404).json({
          success: false,
          message: "Deleted forklift not found",
        });
      }

      forklift.isActive = true;
      forklift.updatedBy = req.user._id;
      await forklift.save();

      res.json({
        success: true,
        message: "Forklift restored successfully",
        data: { forklift },
      });
    } catch (error) {
      console.error("Restore forklift error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to restore forklift",
      });
    }
  }
);

module.exports = router;
