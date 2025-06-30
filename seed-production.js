// Temporary script to seed production database
// Run this locally with production MongoDB URL

require("dotenv").config();

// Override with production MongoDB URL
process.env.MONGODB_URI =
  "mongodb+srv://admin:Waterford1973@cluster0.mxooghw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_EMAIL = "sales@virgilpowerforklifts.com";
process.env.ADMIN_PASSWORD = "Waterford1973";

const seedDatabase = require("./backend/scripts/seedDatabase");

seedDatabase();
