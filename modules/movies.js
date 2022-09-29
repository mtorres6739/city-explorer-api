'use strict';

const axios = require('axios');

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
module.exports = getMovies;