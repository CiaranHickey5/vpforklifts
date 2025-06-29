const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    permissions: {
      forklifts: {
        create: { type: Boolean, default: true },
        read: { type: Boolean, default: true },
        update: { type: Boolean, default: true },
        delete: { type: Boolean, default: true },
      },
      users: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
    },
    // Security tracking
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
        userAgent: String,
        ipAddress: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lockUntil: 1 });

// Virtual for account lock status
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update password changed timestamp
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to handle potential timing issues

    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    username: this.username,
    role: this.role,
    permissions: this.permissions,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "24h",
    issuer: "virgil-power-forklifts",
    audience: "virgil-admin",
  });
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function (userAgent, ipAddress) {
  const refreshToken = jwt.sign(
    { id: this._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );

  // Add to user's refresh tokens array
  this.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent,
    ipAddress,
  });

  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  return refreshToken;
};

// Handle failed login attempts
userSchema.methods.incLoginAttempts = async function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Check if we need to lock the account
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  const lockTime = parseInt(process.env.LOCK_TIME) || 2 * 60 * 60 * 1000; // 2 hours

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() },
  });
};

// Clean up expired refresh tokens
userSchema.methods.cleanupRefreshTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(
    (token) => token.expiresAt > new Date()
  );
  return this.save();
};

// Revoke specific refresh token
userSchema.methods.revokeRefreshToken = function (tokenToRevoke) {
  this.refreshTokens = this.refreshTokens.filter(
    (token) => token.token !== tokenToRevoke
  );
  return this.save();
};

// Revoke all refresh tokens (logout from all devices)
userSchema.methods.revokeAllRefreshTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({
    username: username.toLowerCase(),
    isActive: true,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check if account is locked
  if (user.isLocked) {
    throw new Error(
      "Account temporarily locked due to too many failed login attempts"
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    throw new Error("Invalid credentials");
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  return user;
};

// Static method to create admin user
userSchema.statics.createAdmin = async function (userData) {
  const user = new this({
    ...userData,
    role: "admin",
    permissions: {
      forklifts: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      users: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    },
  });

  return await user.save();
};

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
