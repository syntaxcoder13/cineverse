const WatchHistory = require('../models/WatchHistory');

const getHistory = async (req, res) => {
    try {
        const history = await WatchHistory.find({ userId: req.user._id }).sort({ watchedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addHistory = async (req, res) => {
    try {
        const { movieId, title, poster } = req.body;

        // Use findOneAndUpdate with upsert to either create a new entry or update the watchedAt timestamp
        const history = await WatchHistory.findOneAndUpdate(
            { userId: req.user._id, movieId },
            { title, poster, watchedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearHistory = async (req, res) => {
    try {
        await WatchHistory.deleteMany({ userId: req.user._id });
        res.status(200).json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHistory, addHistory, clearHistory };
