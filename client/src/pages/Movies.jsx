import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exploreMovies } from '../utils/tmdb';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import TrailerModal from '../components/TrailerModal';
import { addFavorite } from '../redux/slices/favoritesSlice';

const GENRES = [
    { id: '', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' }
];

const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'primary_release_date.desc', label: 'Release Date Descending' },
    { value: 'primary_release_date.asc', label: 'Release Date Ascending' }
];

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [genre, setGenre] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState({ id: null, type: 'movie' });

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const fetchMovies = async (pageNum, currentGenre, currentSort) => {
        setLoading(true);
        try {
            const data = await exploreMovies(currentGenre, currentSort, pageNum);
            if (pageNum === 1) {
                setMovies(data.results);
            } else {
                setMovies(prev => [...prev, ...data.results]);
            }
            setHasMore(data.page < data.total_pages);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and filter changes
    useEffect(() => {
        setPage(1);
        fetchMovies(1, genre, sortBy);
        window.scrollTo(0, 0);
    }, [genre, sortBy]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const next = page + 1;
            setPage(next);
            fetchMovies(next, genre, sortBy);
        }
    }, [loading, hasMore, page, genre, sortBy]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

    const handleTrailerClick = (id) => {
        setSelectedMovie({ id, type: 'movie' });
        setModalOpen(true);
    };

    const handleFavoriteClick = (movie) => {
        if (!isAuthenticated) return alert('Please login to add favorites');
        dispatch(addFavorite({
            movieId: movie.id.toString(),
            title: movie.title || movie.name,
            poster: movie.poster_path,
            rating: movie.vote_average
        }));
    };

    return (
        <div className="pt-20 md:pt-28 pb-20 min-h-screen px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-10 gap-4">
                <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide flex items-center gap-3">
                    <span className="w-1.5 h-8 md:h-10 bg-primary rounded-sm block"></span>
                    Explore Movies
                </h1>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto mt-2 xl:mt-0 items-start md:items-center">
                    <div className="flex w-full md:w-[600px] overflow-x-auto gap-2 pb-2 scrollbar-hide">
                        {GENRES.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setGenre(g.id)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${genre === g.id ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/30' : 'bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>

                    <select
                        className="px-4 py-2 bg-white dark:bg-[#18181b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                {movies.map((movie, index) => (
                    <MovieCard
                        key={`${movie.id}-${index}`}
                        movie={{ ...movie, media_type: 'movie' }}
                        onTrailerClick={handleTrailerClick}
                    />
                ))}
                {loading && Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </div>

            {hasMore && (
                <div ref={sentinelRef} className="py-12 flex justify-center w-full">
                    {loading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border border-primary"></div>
                    ) : (
                        <div className="h-10"></div>
                    )}
                </div>
            )}

            <TrailerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                movieId={selectedMovie.id}
                type={selectedMovie.type}
            />
        </div>
    );
};

export default Movies;
