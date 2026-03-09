const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All favorite routes are protected

router.route('/')
    .get(getFavorites)
    .post(addFavorite);

router.route('/:movieId')
    .delete(removeFavorite);

module.exports = router;
