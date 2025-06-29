const mongoose = require("mongoose");

const forkliftSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      maxlength: [50, "SKU cannot exceed 50 characters"],
      index: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      enum: ["Toyota", "Doosan", "Hyster", "Caterpillar", "Linde", "Still"],
      index: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      maxlength: [200, "Model cannot exceed 200 characters"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Electric", "Diesel", "Gas", "Hybrid"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["electric", "diesel", "gas", "hybrid"],
      default: function () {
        return this.type.toLowerCase();
      },
    },
    capacity: {
      type: String,
      required: [true, "Capacity is required"],
      trim: true,
      maxlength: [50, "Capacity cannot exceed 50 characters"],
    },
    lift: {
      type: String,
      required: [true, "Lift height is required"],
      trim: true,
      maxlength: [50, "Lift height cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000000, "Price cannot exceed €1,000,000"],
    },
    priceFormatted: {
      type: String,
      // This will be auto-generated from price
    },
    hirePrice: {
      type: String,
      required: [true, "Hire price is required"],
      trim: true,
      maxlength: [50, "Hire price cannot exceed 50 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: ["In Stock", "Coming Soon", "Sold", "On Hire"],
      default: "In Stock",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      maxlength: [500, "Image URL cannot exceed 500 characters"],
      default:
        "https://images.unsplash.com/photo-1581092160607-ee22df5ddc37?w=600&h=400&fit=crop",
    },
    features: [
      {
        type: String,
        trim: true,
        maxlength: [100, "Feature cannot exceed 100 characters"],
      },
    ],
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
forkliftSchema.index({ brand: 1, type: 1 });
forkliftSchema.index({ price: 1 });
forkliftSchema.index({ featured: 1, status: 1 });
forkliftSchema.index({ createdAt: -1 });
forkliftSchema.index(
  {
    model: "text",
    description: "text",
    brand: "text",
  },
  {
    weights: {
      model: 10,
      brand: 5,
      description: 1,
    },
  }
);

// Virtual for formatted price (auto-generate)
forkliftSchema.virtual("formattedPrice").get(function () {
  return `€${this.price.toLocaleString()}`;
});

// Pre-save middleware to auto-format price
forkliftSchema.pre("save", function (next) {
  if (this.isModified("price")) {
    this.priceFormatted = `€${this.price.toLocaleString()}`;
  }

  // Auto-set category based on type
  if (this.isModified("type")) {
    this.category = this.type.toLowerCase();
  }

  next();
});

// Static methods for common queries
forkliftSchema.statics.findByBrand = function (brand) {
  return this.find({ brand, isActive: true }).sort({
    featured: -1,
    createdAt: -1,
  });
};

forkliftSchema.statics.findFeatured = function () {
  return this.find({ featured: true, isActive: true }).sort({ createdAt: -1 });
};

forkliftSchema.statics.findInStock = function () {
  return this.find({ status: "In Stock", isActive: true }).sort({
    featured: -1,
    createdAt: -1,
  });
};

forkliftSchema.statics.searchForklifts = function (searchTerm, filters = {}) {
  const query = { isActive: true };

  // Add search term if provided
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  // Add filters
  if (filters.brand) query.brand = filters.brand;
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.featured !== undefined) query.featured = filters.featured;
  if (filters.minPrice)
    query.price = { ...query.price, $gte: filters.minPrice };
  if (filters.maxPrice)
    query.price = { ...query.price, $lte: filters.maxPrice };

  return this.find(query).sort({
    score: searchTerm ? { $meta: "textScore" } : undefined,
    featured: -1,
    createdAt: -1,
  });
};

// Instance methods
forkliftSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

forkliftSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

// Validation for specs object
forkliftSchema.path("specs").validate(function (specs) {
  if (!specs) return true;

  for (let [key, value] of specs) {
    if (typeof key !== "string" || key.length > 50) {
      throw new Error("Spec key must be a string with max 50 characters");
    }
    if (typeof value !== "string" || value.length > 100) {
      throw new Error("Spec value must be a string with max 100 characters");
    }
  }
  return true;
}, "Invalid specs format");

// Custom validation for features array
forkliftSchema.path("features").validate(function (features) {
  return features.length <= 20; // Max 20 features
}, "Cannot have more than 20 features");

const Forklift = mongoose.model("Forklift", forkliftSchema);

module.exports = { Forklift, forkliftSchema };
