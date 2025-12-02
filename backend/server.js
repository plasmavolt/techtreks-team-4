require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('MongoDB connection error:', error));

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