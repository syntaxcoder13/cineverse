const express = require('express');
const router = express.Router();
const { getHistory, addHistory, clearHistory } = require('../controllers/watchHistory.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All history routes are protected

router.route('/')
    .get(getHistory)
    .post(addHistory)
    .delete(clearHistory);

module.exports = router;
