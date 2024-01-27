const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');

const app = express();
const port = 3000;

let tourHistory = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.route('/travelagency')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'travelagency.html'));
    })
    .post(async (req, res) => {
        try {
            const { country, city, hotel, arrivalDate, departureDate, adults, children } = req.body;

            if (!country || !city || !hotel || !arrivalDate || !departureDate || !adults || !children) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            // Calculate tour cost
            const tourCost = calculateTourCost(adults, children);

            // Get weather conditions using WeatherAPI
            const weatherConditions = await getWeatherConditions(city);

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

            // Send a response with tour result and history
            res.json({
                direction: calculateDirection(weatherConditions),
                reservationStatus: tourCost > 500 ? 'Confirmed' : 'Pending',
                availabilityStatus: adults + children <= 10 ? 'Available' : 'Fully Booked',
                history: tourHistory,
                message: 'Tour calculated successfully!',
            });
        } catch (error) {
            console.error('Error calculating tour:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

app.get('/history', (req, res) => {
    res.json(tourHistory);
});

function calculateTourCost(adults, children) {
    const adultCost = 100;
    const childCost = 50;
    return adults * adultCost + children * childCost;
}

async function getWeatherConditions(city) {
    const apiKey = 'f0b917381c4240aaa45111118241701'; // Your WeatherAPI key
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data.current.condition.text;
    } catch (error) {
        console.error('Error fetching weather data:', error.response?.data || error.message);
        return 'Weather data unavailable';
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
