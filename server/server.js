const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/favorites', require('./routes/favorite.routes'));
app.use('/api/history', require('./routes/watchHistory.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/movies', require('./routes/movie.routes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const parentDir = path.resolve(__dirname, '..');
    app.use(express.static(path.join(parentDir, 'client', 'dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(parentDir, 'client', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
