'use strict';

const axios = require('axios');
const cache = require('./cache.js');

async function getMovies(request, response) {
  const searchQuery = request.query.searchQuery;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

  try {
    const key = searchQuery + 'movie';

    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Cache miss');
      const movieResponse = await axios.get(movieUrl);
      const movieData = movieResponse.data.results.map(movie => new Movie(movie));

      cache[key] = {
        data: movieData,
        timestamp: Date.now()
      };
      console.log('Cache is: ', cache);
      response.status(200).send(movieData);
    }
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
module.exports = getMovies;