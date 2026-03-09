import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMulti } from '../utils/tmdb';
import api from '../utils/api';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import TrailerModal from '../components/TrailerModal';
import { addFavorite } from '../redux/slices/favoritesSlice';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    const [query, setQuery] = useState(queryParam);
    const debouncedQuery = useDebounce(query, 500);

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState({ id: null, type: 'movie' });

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // When URL param changes, update local query state if different
        if (queryParam !== query) {
            setQuery(queryParam);
        }
    }, [queryParam]);

    useEffect(() => {
        // Reset and fetch new search when debounced query changes
        const fetchInitialSearch = async () => {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }

            setSearchParams({ q: debouncedQuery });
            setLoading(true);
            setPage(1);

            try {
                // Fetch from TMDB
                const tmdbData = await searchMulti(debouncedQuery, 1);
                const tmdbResults = tmdbData.results.filter(item => item.media_type !== 'person' || item.profile_path);

                // Fetch from our local DB
                const localRes = await api.get(`/movies/search`, { params: { query: debouncedQuery } });
                const localResults = localRes.data;

                // Combine results (Local first)
                setResults([...localResults, ...tmdbResults]);
                setHasMore(tmdbData.page < tmdbData.total_pages);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialSearch();
    }, [debouncedQuery, setSearchParams]);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore || !debouncedQuery) return;

        const nextPage = page + 1;
        setLoading(true);

        try {
            const data = await searchMulti(debouncedQuery, nextPage);
            const filteredResults = data.results.filter(item => item.media_type !== 'person' || item.profile_path);

            setResults(prev => [...prev, ...filteredResults]);
            setPage(nextPage);
            setHasMore(data.page < data.total_pages);
        } catch (error) {
            console.error('Search pagination error:', error);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, page, hasMore, loading]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

    const handleTrailerClick = (id, type) => {
        setSelectedMovie({ id, type });
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
        <div className="pt-24 md:pt-32 pb-20 min-h-screen px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <div className="mb-6 md:mb-8">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies, tv shows, or people..."
                    className="w-full md:w-2/3 lg:w-1/2 p-4 text-xl bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 focus:border-primary rounded-xl outline-none text-gray-900 dark:text-white shadow-lg transition-all"
                />
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
                {debouncedQuery ? `Search Results for "${debouncedQuery}"` : 'Search for something'}
            </h2>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                    {results.map((item, index) => {
                        if (item.media_type === 'person') {
                            return (
                                <div key={`${item.id}-${index}`} className="flex flex-col items-center group/person cursor-pointer">
                                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] mb-2 relative">
                                        <img
                                            src={item.profile_path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${item.profile_path}` : '/placeholder-person.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transform group-hover/person:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2 bg-blue-600 text-xs px-2 py-1 rounded font-bold uppercase text-gray-900 dark:text-white shadow-md z-10">Person</div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent opacity-0 group-hover/person:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                            <div className="translate-y-4 group-hover/person:translate-y-0 transition-transform duration-300">
                                                <Link
                                                    to={`/person/${item.id}`}
                                                    className="w-full py-1.5 bg-primary text-gray-900 dark:text-white text-xs font-bold rounded text-center hover:scale-105 block shadow-lg shadow-primary/20"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-900 dark:text-white text-sm font-medium text-center">{item.name}</h3>
                                </div>
                            );
                        }

                        return (
                            <div key={`${item.id}-${index}`} className="relative">
                                <div className="absolute top-3 right-3 z-10 bg-primary/90 text-[9px] px-2 py-0.5 rounded font-bold uppercase text-white shadow-md pointer-events-none">
                                    {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                </div>
                                <MovieCard
                                    movie={item}
                                    onTrailerClick={handleTrailerClick}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : debouncedQuery && !loading ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-20">
                    <p className="text-2xl mb-4">No results found for "{debouncedQuery}"</p>
                    <p>Try refining your search terms.</p>
                </div>
            ) : null}

            {/* Infinite Scroll Sentinel */}
            {debouncedQuery && hasMore && (
                <div ref={sentinelRef} className="py-8 flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
            )}

            {loading && results.length === 0 && debouncedQuery && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                    {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
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

export default Search;
