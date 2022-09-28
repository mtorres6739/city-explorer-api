'use strict';
// This will be our server

// Setup

require('dotenv').config();
// express server
const express = require('express');
// Allows for Cross Origin Resource Sharing
const cors = require('cors');
// Load data
const data = require('./data/weather.json');
// Start the server
const app = express();

// Middleware
// This app.use() function is used to mount the specified middleware function or functions at the path which is being specified.
app.use(cors());

// Declare our PORT variable
const PORT = process.env.PORT || 3001;

// Listening for connection
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

// Endpoints

app.get('/', (request, response) => {
  response.send('Hello World from your new Express Server');
});

app.get('/weather', (request, response) => {
  //   request.query.lat;
  //   request.query.lon;
  //   request.query.searchQuery;
  // console.log(request.query);
  // response.send(data);
  const city_name = request.query.searchQuery;
  const forecast = data.find(city => city.city_name === city_name);

  response.send(forecast);

});



// Catch all endpoint
app.get('*', (request, response) => {
  response.status(404).send('Not Found. Sorry Dude!');
});

function formatWeather(arr) {
  const newArr = arr.map(item => {
    return new Forecast(item);
  }
  );
  return newArr;
}

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

