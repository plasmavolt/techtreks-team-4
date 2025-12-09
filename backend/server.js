require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file!');
  console.error('Please create a .env file in the backend directory with:');
  console.error('MONGODB_URI=mongodb://localhost:27017/sidequest');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('\nMake sure MongoDB is running on your machine.');
    console.error('To start MongoDB:');
    console.error('  - macOS (Homebrew): brew services start mongodb-community');
    console.error('  - Linux: sudo systemctl start mongod');
    console.error('  - Windows: net start MongoDB');
  });

// Import routes
const locationRoutes = require('./routes/locations');
const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenges');
const friendRoutes = require('./routes/friends');

// Use routes
app.use('/', locationRoutes);
app.use('/', userRoutes);
app.use('/', challengeRoutes);
app.use('/', friendRoutes);


// Root route
app.get('/', (req, res) => {
  res.send("Hello from SideQuest backend!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});