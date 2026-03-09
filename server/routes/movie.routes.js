const express = require('express');
const router = express.Router();
const { searchMovies, getMovieById } = require('../controllers/movie.controller');

router.get('/search', searchMovies);
router.get('/:id', getMovieById);

module.exports = router;
