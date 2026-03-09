import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrending } from '../utils/tmdb';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import TrailerModal from '../components/TrailerModal';
import { addFavorite } from '../redux/slices/favoritesSlice';
import { Flame } from 'lucide-react';

const TIME_OPTIONS = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
];

const MEDIA_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
];

const Trending = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [timeWindow, setTimeWindow] = useState('day');
    const [mediaType, setMediaType] = useState('all');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState({ id: null, type: 'movie' });

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const fetchTrending = async (pageNum, tw, mt) => {
        setLoading(true);
        try {
            const data = await getTrending(mt, tw, pageNum);
            if (pageNum === 1) {
                setItems(data?.results || []);
            } else {
                setItems(prev => [...prev, ...(data?.results || [])]);
            }
            setHasMore(data.page < data.total_pages);
        } catch (error) {
            console.error('Error fetching trending:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchTrending(1, timeWindow, mediaType);
        window.scrollTo(0, 0);
    }, [timeWindow, mediaType]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const next = page + 1;
            setPage(next);
            fetchTrending(next, timeWindow, mediaType);
        }
    }, [loading, hasMore, page, timeWindow, mediaType]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

    const handleTrailerClick = (id, type) => {
        setSelectedMovie({ id, type: type || 'movie' });
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
        <div className="pt-24 pb-20 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-4xl font-bebas text-gray-900 dark:text-white tracking-wide flex items-center gap-3">
                    <Flame size={32} className="text-orange-500" />
                    Trending Now
                </h1>

                <div className="flex flex-wrap gap-3">
                    {/* Time Filter */}
                    <div className="flex bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 rounded-full p-1 gap-1">
                        {TIME_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setTimeWindow(opt.value)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${timeWindow === opt.value
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Media Type Filter */}
                    <div className="flex bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-700 rounded-full p-1 gap-1">
                        {MEDIA_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setMediaType(opt.value)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${mediaType === opt.value
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {items.map((item, index) => (
                    <MovieCard
                        key={`${item.id}-${index}`}
                        movie={{ ...item, media_type: item.media_type || mediaType }}
                        onTrailerClick={handleTrailerClick}
                        onFavoriteClick={handleFavoriteClick}
                    />
                ))}
                {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
            </div>

            {hasMore && (
                <div ref={sentinelRef} className="py-12 flex justify-center w-full">
                    {loading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border border-pink-500"></div>
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

export default Trending;
