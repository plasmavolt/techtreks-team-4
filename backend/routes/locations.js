const express = require('express');
const router = express.Router();
const axios = require('axios');
const Location = require('../models/Location');

// Test routes ONLY USED TO TEST IF API's WORKED
router.get('/yelp-test', async (req, res) => {
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

router.get('/ticketmaster-test', async (req, res) => {
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

// Save routes
router.get('/save-yelp-places', async (req, res) => {
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

router.get('/save-ticketmaster-events', async (req, res) => {
  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: process.env.TICKETMASTER_API_KEY,
        city: 'New York',
        size: 10,
        sort: 'date,asc'
      }
    });
    
    const ticketmasterEvents = response.data._embedded.events;
    const savedEvents = [];
    
    for (const event of ticketmasterEvents) {
      const venue = event._embedded.venues[0];
      
      const locationDoc = new Location({
        _id: `ticketmaster_${event.id}`,
        originalId: event.id,
        source: 'ticketmaster',
        type: 'event',
        name: event.name,
        categories: event.classifications ? 
          event.classifications.map(c => c.segment?.name?.toLowerCase()).filter(Boolean) : [],
        imageUrl: event.images?.[0]?.url || null,
        url: event.url,
        coordinates: {
          latitude: parseFloat(venue.location.latitude),
          longitude: parseFloat(venue.location.longitude)
        },
        address: {
          street: venue.address?.line1 || null,
          city: venue.city?.name || 'New York',
          state: venue.state?.stateCode || 'NY',
          zipCode: venue.postalCode || null
        },
        borough: venue.city?.name === 'New York' ? 'Manhattan' : venue.city?.name,
        eventDetails: {
          startDate: event.dates.start.localDate,
          startTime: event.dates.start.localTime || null,
          timezone: event.dates.timezone || 'America/New_York'
        }
      });
      
      await locationDoc.save();
      savedEvents.push(locationDoc);
    }
    
    res.json({
      message: `Saved ${savedEvents.length} events to MongoDB!`,
      events: savedEvents
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API routes
router.get('/api/places', async (req, res) => {
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

router.get('/api/events', async (req, res) => {
  try {
    const events = await Location.find({ type: 'event' });
    res.json({
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.json({
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;