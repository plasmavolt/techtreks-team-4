const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: String,
  originalId: String,
  source: {
    type: String,
    enum: ['yelp', 'ticketmaster']
  },
  type: {
    type: String,
    enum: ['place', 'event']
  },
  

  name: { type: String, required: true },
  categories: [String],
  imageUrl: String,
  url: String,
  
 
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  borough: String,
  

  eventDetails: {
    startDate: String,
    startTime: String,
    timezone: String
  },
  
 
  placeDetails: {
    rating: Number,
    priceLevel: String
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Location', locationSchema);