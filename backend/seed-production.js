// Seed production database
// Run from backend directory: node seed-production.js

require('dotenv').config();

// Override with production MongoDB URL
process.env.MONGODB_URI = 'mongodb+srv://admin:Waterford1973@cluster0.mxooghw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_EMAIL = 'sales@virgilpowerforklifts.com';
process.env.ADMIN_PASSWORD = 'Waterford1973'; 

const seedDatabase = require('./scripts/seedDatabase');

console.log('🌱 Seeding production database...');
console.log('🔐 Admin credentials:');
console.log('   Username:', process.env.ADMIN_USERNAME);
console.log('   Email:', process.env.ADMIN_EMAIL);
console.log('   Password:', process.env.ADMIN_PASSWORD);

seedDatabase();