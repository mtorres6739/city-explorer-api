'use strict';
const axios = require('axios');
const cache = require('./cache.js');


async function getWeatherBit(request, response) {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const searchQuery = request.query.searchQuery;
  const weatherBitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?${searchQuery}&lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_API_KEY}`;

  try {
    const key = searchQuery + lat + lon + 'weatherbit';


    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Cache miss');
      const weatherBitResponse = await axios.get(weatherBitUrl);
      const weatherBitData = weatherBitResponse.data.data.map(day => new Weather(day));

      cache[key] = {
        data: weatherBitData,
        timestamp: Date.now()
      };
      console.log('Cache is: ', cache);
      response.status(200).send(weatherBitData);
    }
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

module.exports = getWeatherBit;