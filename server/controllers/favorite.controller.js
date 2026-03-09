const Favorite = require('../models/Favorite');

const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id }).sort({ addedAt: -1 });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addFavorite = async (req, res) => {
    try {
        const { movieId, title, poster, rating } = req.body;

        // Check if already exists
        const exists = await Favorite.findOne({ userId: req.user._id, movieId });
        if (exists) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        const favorite = await Favorite.create({
            userId: req.user._id,
            movieId,
            title,
            poster,
            rating
        });

        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { movieId } = req.params;
        const favorite = await Favorite.findOneAndDelete({ userId: req.user._id, movieId });

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ movieId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
