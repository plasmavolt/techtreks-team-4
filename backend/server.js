require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose'); 
const Location = require('./models/Location');


const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/', (req, res) => {
    res.send("Hello from SideQuest backend!")
});

app.get('/yelp-test', async (req, res) => {
    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          'Authorization': `Bearer ${process.env.YELP_API_KEY}`
        },
        params: {
          location: 'New York',
          term: 'restaurants',
          limit: 5
        }
      });
      
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/eventbrite-test', async (req, res) => {
    try {
      const orgsResponse = await axios.get('https://www.eventbriteapi.com/v3/users/me/organizations/', {
        headers: {
          'Authorization': `Bearer ${process.env.EVENTBRITE_API_KEY}`
        }
      });
      
      res.json({
        message: "Your organizations",
        data: orgsResponse.data
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: error.response?.data 
      });
    }
  });


app.get('/ticketmaster-test', async (req, res) => {
try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
    params: {
        apikey: process.env.TICKETMASTER_API_KEY,
        city: 'New York',
        size: 5,
        sort: 'date,asc'
    }
    });
    
    res.json(response.data);
} catch (error) {
    res.status(500).json({ 
    error: error.message,
    details: error.response?.data 
    });
}
});

app.get('/save-yelp-places', async (req, res) => {
  try {

    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      },
      params: {
        location: 'New York',
        term: 'restaurants',
        limit: 5
      }
    });
    
    const yelpPlaces = response.data.businesses;
    const savedPlaces = [];
    
  
    for (const place of yelpPlaces) {
      const locationDoc = new Location({
        _id: `yelp_${place.id}`,
        originalId: place.id,
        source: 'yelp',
        type: 'place',
        name: place.name,
        categories: place.categories.map(cat => cat.alias),
        imageUrl: place.image_url,
        url: place.url,
        coordinates: {
          latitude: place.coordinates.latitude,
          longitude: place.coordinates.longitude
        },
        address: {
          street: place.location.address1,
          city: place.location.city,
          state: place.location.state,
          zipCode: place.location.zip_code
        },
        borough: place.location.city === 'New York' ? 'Manhattan' : place.location.city,
        placeDetails: {
          rating: place.rating,
          priceLevel: place.price || null
        }
      });
      
      await locationDoc.save();
      savedPlaces.push(locationDoc);
    }
    
    res.json({
      message: `Saved ${savedPlaces.length} places to MongoDB!`,
      places: savedPlaces
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/places', async (req, res) => {
  try {
    const places = await Location.find({ type: 'place' });
    res.json({
      count: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});