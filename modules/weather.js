'use strict';

async function getWeather(request, response) {

  try {
    const city_name = request.query.searchQuery;
    const forecast = data.find((city) => city.city_name === city_name);
    const forecastArr = forecast.data.map(element => new Forecast(element.datetime, element.weather.description));
    response.status(200).send(forecastArr);
  } catch (error) {
    response.status(500).send('Sorry, something went wrong');
  }
}





class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

module.exports = getWeather;
