const mongoose = require("mongoose");
const { Forklift } = require("../models/Forklift");
const { User } = require("../models/User");
require("dotenv").config();

const initialForklifts = [
  {
    sku: "TOY-3WE-001",
    brand: "Toyota",
    model: "3-Wheel Electric Forklift",
    type: "Electric",
    capacity: "1,500-2,000 kg",
    lift: "Up to 6,000 mm",
    price: 18500,
    hirePrice: "€180/week",
    status: "In Stock",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22df5ddc37?w=600&h=400&fit=crop",
    features: [
      "Compact design",
      "AC power",
      "360° steering",
      "Ideal for narrow aisles",
    ],
    description:
      "The Toyota 3-Wheel Electric Forklift offers exceptional maneuverability in tight spaces.",
    specs: {
      "Load Capacity": "1,500-2,000 kg",
      "Lift Height": "Up to 6,000 mm",
      "Fork Length": "1,070 mm",
      Battery: "48V / 460-625Ah",
    },
  },
  {
    sku: "TOY-CE-002",
    brand: "Toyota",
    model: "Core Electric Forklift",
    type: "Electric",
    capacity: "2,000-3,500 kg",
    lift: "Up to 7,000 mm",
    price: 24500,
    hirePrice: "€220/week",
    status: "In Stock",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1581092162384-ff0c5df7c1f0?w=600&h=400&fit=crop",
    features: [
      "4-wheel stability",
      "Regenerative braking",
      "Wet disc brakes",
      "T-Matics ready",
    ],
    description:
      "The Toyota Core Electric Forklift is ideal for most indoor and warehouse applications.",
    specs: {
      "Load Capacity": "2,000-3,500 kg",
      "Lift Height": "Up to 7,000 mm",
      "Fork Length": "1,150 mm",
      Battery: "48V / 625-775Ah",
    },
  },
  {
    sku: "DOO-7SE-010",
    brand: "Doosan",
    model: "7-Series Electric B20-35X",
    type: "Electric",
    capacity: "2,000-3,500 kg",
    lift: "Up to 7,500 mm",
    price: 26500,
    hirePrice: "€240/week",
    status: "In Stock",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1581092921562-c43e6f3c0a0e?w=600&h=400&fit=crop",
    features: [
      "AC motors",
      "Regenerative braking",
      "Curtis controller",
      "Curved overhead guard",
    ],
    description:
      "Powerful electric forklift designed for intensive operations.",
    specs: {
      "Load Capacity": "2,000-3,500 kg",
      "Lift Height": "Up to 7,500 mm",
      Battery: "48V / 625-930Ah",
      Controller: "Curtis AC",
    },
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Create admin user first
    const adminExists = await User.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    let adminUser;
    if (!adminExists) {
      adminUser = await User.createAdmin({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log("✅ Admin user created");
    } else {
      adminUser = adminExists;
      console.log("ℹ️  Admin user already exists");
    }

    // Clear existing forklifts
    await Forklift.deleteMany({});
    console.log("🗑️  Cleared existing forklifts");

    // Add createdBy field to all forklifts
    const forkliftData = initialForklifts.map((forklift) => ({
      ...forklift,
      createdBy: adminUser._id,
    }));

    // Insert new forklifts
    const createdForklifts = await Forklift.insertMany(forkliftData);
    console.log(`✅ Inserted ${createdForklifts.length} forklifts`);

    console.log("🎉 Database seeding completed successfully!");
    console.log(
      `📊 Created: ${createdForklifts.length} forklifts, 1 admin user`
    );
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
