'use strict';
// This will be our server

// Setup

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const data = require('./data/weather.json');
const getWeatherBit = require('./modules/getWeatherBit.js');
const getMovies = require('./modules/movies.js');
const getWeather = require('./modules/weather.js');

const PORT = process.env.PORT || 3001;
app.use(cors());

// Listening for connection
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// Endpoints

app.get('/', (request, response) => {
  response.send('Hello World from your new Express Server');
});

// WeatherBit Route
app.get('/weatherBit', getWeatherBit);

// Movie Route
app.get('/movies', getMovies);

// Weather Old Route
app.get('/weather', getWeather);



// Catch all endpoint
app.get('*', (request, response) => {
  response.status(404).send('Not Found. Sorry Dude!');
});
