const express = require('express');
const axios = require('axios');
const moment = require('moment');
const router = express.Router();

// Sample data for recently selected tours (for demonstration purposes)
let tourHistory = [];

// Sample API key for weather API (replace with your own key)
const weatherApiKey = 'your_weather_api_key';

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/../views/index.html');
});

router.post('/calculateTour', async (req, res) => {
    try {
        const { country, city, hotel, arrivalDate, departureDate, adults, children } = req.body;

        // Validate the selected values against the predefined list
        const isValidSelection = validateSelectedValues(country, city, hotel);

        if (isValidSelection) {
            // Call weather API to get weather conditions (replace with your own API)
            const weatherConditions = await getWeatherConditions(weatherApiKey, city);

            // Logic to calculate tour cost (replace with your own logic)
            const tourCost = calculateTourCost(adults, children);

            // Record the tour in history
            const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            const tour = {
                country,
                city,
                hotel,
                arrivalDate,
                departureDate,
                adults,
                children,
                tourCost,
                weatherConditions,
                timestamp,
            };
            tourHistory.push(tour);

            // Send response with tour result and history
            res.json({
                tourResult: tour,
                history: tourHistory,
                message: 'Tour calculated successfully!',
            });
        } else {
            res.status(400).json({ error: 'Invalid selection. Please choose values from the list.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/history', (req, res) => {
    res.json(tourHistory);
});

// Function to validate selected values against predefined list
function validateSelectedValues(country, city, hotel) {
    const validCountries = ['usa', 'uk', 'japan']; // Add more countries as needed
    const validCities = {
        usa: ['ny', 'la'], // Add more cities for each country as needed
        uk: ['ldn', 'manchester'],
        japan: ['tokyo', 'osaka']
    };
    const validHotels = {
        usa: ['sheraton', 'hilton'], // Add more hotels for each country as needed
        uk: ['marriott', 'radisson'],
        japan: ['tokyo_hotel', 'osaka_resort']
    };

    if (!validCountries.includes(country)) {
        return false; // Invalid country
    }

    if (!validCities[country].includes(city)) {
        return false; // Invalid city for the selected country
    }

    if (!validHotels[country].includes(hotel)) {
        return false; // Invalid hotel for the selected country
    }

    return true;
}

// Function to calculate tour cost (replace with your own logic)
function calculateTourCost(adults, children) {
    // Sample calculation for demonstration purposes
    const adultCost = 100;
    const childCost = 50;
    return adults * adultCost + children * childCost;
}

// Function to get weather conditions from a placeholder API
async function getWeatherConditions(apiKey, city) {
    // Replace this URL with your own weather API endpoint
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data.weather[0].description;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return 'Weather data unavailable';
    }
}

module.exports = router;
