const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    poster: { type: String },
    description: { type: String },
    movieId: { type: String },
    releaseDate: { type: String },
    trailerLink: { type: String },
    genre: [{ type: String }],
    category: { type: String, enum: ['movie', 'tv'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
