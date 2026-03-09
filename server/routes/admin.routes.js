const express = require('express');
const router = express.Router();
const { getAdminMovies, addMovie, editMovie, deleteMovie, getUsers, banUser, deleteUser } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.use(protect, admin); // Apply protect and admin middleware to all routes below

router.route('/movies')
    .get(getAdminMovies)
    .post(addMovie);

router.route('/movies/:id')
    .put(editMovie)
    .delete(deleteMovie);

router.route('/users')
    .get(getUsers);

router.route('/users/:id/ban')
    .put(banUser);

router.route('/users/:id')
    .delete(deleteUser);

module.exports = router;
