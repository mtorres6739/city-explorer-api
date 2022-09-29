'use strict';
// This will be our server

// Setup

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const data = require('./data/weather.json');

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


// Weather Route
app.get('/weatherBit', getWeatherBit);

async function getWeatherBit(request, response) {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const searchQuery = request.query.searchQuery;
  const weatherBitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_API_KEY}`;

  try {
    const weatherBitResponse = await axios.get(weatherBitUrl);
    const weatherBitData = weatherBitResponse.data.data.map(day => new Weather(day));
    response.status(200).send(weatherBitData);
  } catch (error) {
    response.status(500).send('Sorry, something went wrong');
  }
}

class Weather {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
    this.highTemp = day.high_temp;
    this.lowTemp = day.low_temp;
  }
}

// Movie Route
app.get('/movies', getMovies);

async function getMovies(request, response) {
  const searchQuery = request.query.searchQuery;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

  try {
    const movieResponse = await axios.get(movieUrl);
    const movieData = movieResponse.data.results.map(movie => new Movie(movie));
    response.status(200).send(movieData);
  } catch (error) {
    response.status(500).send('Sorry, something went wrong');
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}



app.get('/weather', (request, response) => {
  //   request.query.lat;
  //   request.query.lon;
  //   request.query.searchQuery;
  // console.log(request.query);
  // response.send(data);
  try {

    const city_name = request.query.searchQuery;
    const forecast = data.find(city => city.city_name === city_name);
    const forecastArr = forecast.data.map(element => new Forecast(element.datetime, element.weather.description));

    response.send(forecastArr);
  } catch (error) {
    response.status(500).send('Something horrible went wrong!');
  }

});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Catch all endpoint
app.get('*', (request, response) => {
  response.status(404).send('Not Found. Sorry Dude!');
});
