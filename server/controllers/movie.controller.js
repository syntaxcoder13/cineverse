const Movie = require('../models/Movie');

const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json([]);
        }

        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        // Normalize to TMDB-like format for frontend consistency
        const normalizedMovies = movies.map(movie => ({
            id: movie._id.toString(),
            title: movie.title,
            name: movie.title, // for TV shows compatibility
            poster_path: movie.poster,
            overview: movie.description,
            release_date: movie.releaseDate,
            first_air_date: movie.releaseDate,
            media_type: movie.category,
            isLocal: true, // flag to distinguish local movies
            genre_ids: [], // local movies might not have TMDB genre IDs
            vote_average: 0
        }));

        res.status(200).json(normalizedMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        // Normalize for Detail page
        const normalized = {
            id: movie._id.toString(),
            title: movie.title,
            name: movie.title,
            poster_path: movie.poster,
            backdrop_path: movie.poster, // Use poster as backdrop if not available
            overview: movie.description,
            release_date: movie.releaseDate,
            first_air_date: movie.releaseDate,
            genres: movie.genre.map((g, i) => ({ id: i, name: g })),
            runtime: 0,
            vote_average: 0,
            isLocal: true,
            videos: {
                results: movie.trailerLink ? [{ key: movie.trailerLink.split('v=')[1] || movie.trailerLink, site: 'YouTube', type: 'Trailer' }] : []
            }
        };

        res.status(200).json(normalized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchMovies, getMovieById };
