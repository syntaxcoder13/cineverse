const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    title: { type: String },
    poster: { type: String },
    watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
