import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Star, Clock, Calendar, Heart, Image as ImageIcon, User, Bookmark, Eye } from 'lucide-react';
import { getMovieDetails, getTVShowDetails } from '../utils/tmdb';
import api from '../utils/api';
import { addToHistory } from '../redux/slices/watchHistorySlice';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { addBookmark, removeBookmark } from '../redux/slices/bookmarkSlice';
import TrailerModal from '../components/TrailerModal';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const MovieDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const isTV = location.pathname.includes('/tv/');

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState({ id: null, type: 'movie' });
    const [imgError, setImgError] = useState(false);
    const [actorImgErrors, setActorImgErrors] = useState({});

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const watchlist = useSelector(state => state.watchlist.items);
    const bookmarks = useSelector(state => state.bookmarks.items);
    const favorites = useSelector(state => state.favorites.favorites);

    const isWatchlisted = item && watchlist.some(w => String(w.id) === String(item.id));
    const isBookmarked = item && bookmarks.some(b => String(b.id) === String(item.id));
    const isFavorited = item && favorites.some(f => String(f.movieId) === String(item.id));
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                let data;
                // If ID is 24 chars hex (MongoDB format), it's a local movie
                const isLocalMovie = /^[0-9a-fA-F]{24}$/.test(id);

                if (isLocalMovie) {
                    const res = await api.get(`/movies/${id}`);
                    data = res.data;
                } else {
                    data = isTV ? await getTVShowDetails(id) : await getMovieDetails(id);
                }

                setItem(data);

                // Auto-save to watch history
                if (isAuthenticated && data) {
                    dispatch(addToHistory({
                        movieId: data.id.toString(),
                        title: data.title || data.name,
                        poster: data.poster_path
                    }));
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        window.scrollTo(0, 0);
    }, [id, isTV, isAuthenticated, dispatch]);

    const handleFavoriteClick = () => {
        if (!isAuthenticated) return alert('Please login to add to favorites');
        if (item) {
            if (isFavorited) {
                dispatch(removeFavorite(item.id.toString()));
            } else {
                dispatch(addFavorite({
                    movieId: item.id.toString(),
                    title: item.title || item.name,
                    poster: item.poster_path,
                    rating: item.vote_average
                }));
            }
        }
    };

    const handleWatchlistClick = () => {
        if (!isAuthenticated) return alert('Please login to add to your watchlist');
        if (!item) return;
        if (isWatchlisted) {
            dispatch(removeFromWatchlist(item.id));
        } else {
            dispatch(addToWatchlist(item));
        }
    };

    const handleBookmarkClick = () => {
        if (!isAuthenticated) return alert('Please login to bookmark items');
        if (!item) return;
        if (isBookmarked) {
            dispatch(removeBookmark(item.id));
        } else {
            dispatch(addBookmark(item));
        }
    };

    const handleTrailerClick = (movieId, type) => {
        setSelectedTrailer({ id: movieId, type });
        setModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border border-pink-500"></div>
            </div>
        );
    }

    if (!item) return <div className="pt-32 text-center text-gray-900 dark:text-white text-2xl">Item not found</div>;

    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? releaseDate.substring(0, 4) : '';
    const runtime = item.runtime || (item.episode_run_time && item.episode_run_time[0]);

    const cast = item.credits?.cast?.slice(0, 10) || [];
    const similar = item.similar?.results?.filter(i => i.poster_path).slice(0, 10) || [];

    return (
        <div className="pb-20 bg-gray-50 dark:bg-[#050508] min-h-screen">
            {/* Hero Backdrop */}
            <div className="relative min-h-[75vh] md:min-h-[85vh] w-full bg-[#050508] flex items-end">
                <div className="absolute inset-0 z-0">
                    {(item.backdrop_path || item.poster_path) && (
                        <img
                            src={item.backdrop_path?.startsWith('http') ? item.backdrop_path : `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/original'}${item.backdrop_path || item.poster_path}`}
                            alt={title}
                            className="w-full h-full object-cover opacity-30 object-top"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 max-w-[1600px] w-full flex flex-col md:flex-row items-start md:items-end pb-12 pt-28 md:pt-32 gap-6 md:gap-8">
                    {/* Poster */}
                    <div className="hidden md:block w-56 lg:w-80 flex-shrink-0 shadow-2xl shadow-black/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 translate-y-16 lg:translate-y-24 bg-gray-200 dark:bg-[#09090b] aspect-[2/3]">
                        {item.poster_path && !imgError ? (
                            <img
                                src={item.poster_path.startsWith('http') ? item.poster_path : `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${item.poster_path}`}
                                alt={title}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-600">
                                <ImageIcon size={64} className="mb-4 opacity-50" />
                                <span className="text-center font-medium text-lg leading-tight">{title}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-end text-gray-900 dark:text-white pb-2 md:pb-0 z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-wide mb-2 md:mb-4 text-shadow-md leading-tight drop-shadow-lg">{title}</h1>
                        {item.tagline && <p className="text-lg md:text-xl text-gray-300 dark:text-gray-400 italic mb-4 drop-shadow-md">{item.tagline}</p>}

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6">
                            <div className="flex items-center text-[#f5c518]">
                                <Star size={18} className="fill-current mr-1" />
                                <span className="text-gray-900 dark:text-white text-base">{item.vote_average?.toFixed(1)}</span>
                            </div>
                            {year && (
                                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] px-3 py-1 rounded-full">
                                    <Calendar size={14} className="mr-2" /> {year}
                                </div>
                            )}
                            {runtime && (
                                <div className="flex items-center text-gray-700 dark:text-gray-300 bg-white dark:bg-[#18181b] px-3 py-1 rounded-full">
                                    <Clock size={14} className="mr-2" /> {runtime} min
                                </div>
                            )}
                            <div className="flex gap-2 flex-wrap">
                                {item.genres?.map(g => (
                                    <span key={g.id} className="border border-gray-600 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-[#09090b]/50">{g.name}</span>
                                ))}
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                            {item.overview}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-2 mb-4 md:mb-0">
                            <button
                                onClick={() => handleTrailerClick(item.id, isTV ? 'tv' : 'movie')}
                                className="px-6 py-3 md:px-8 bg-primary text-white font-bold rounded-full hover:scale-105 hover:shadow-primary/50 transition-all flex items-center shadow-lg shadow-primary/30"
                            >
                                <Play size={20} className="mr-2" /> Watch Trailer
                            </button>
                            <button
                                onClick={handleFavoriteClick}
                                className={`px-6 py-3 backdrop-blur-sm text-white font-bold rounded-full transition-all flex items-center border border-white/20 shadow-lg ${isFavorited ? 'bg-primary hover:bg-accent' : 'bg-gray-800/80 hover:bg-gray-700'}`}
                            >
                                <Heart size={20} className={`mr-2 ${isFavorited ? 'fill-current text-white' : 'text-primary'}`} /> {isFavorited ? "Favorited" : "Favorite"}
                            </button>
                            <button
                                onClick={handleWatchlistClick}
                                className={`px-6 py-3 backdrop-blur-sm text-white font-bold rounded-full transition-all flex items-center border border-white/20 shadow-lg ${isWatchlisted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800/80 hover:bg-gray-700'}`}
                            >
                                <Eye size={20} className={`mr-2 ${isWatchlisted ? 'fill-current text-white' : 'text-blue-400'}`} /> {isWatchlisted ? "Watching" : "Watchlist"}
                            </button>
                            <button
                                onClick={handleBookmarkClick}
                                className={`px-6 py-3 backdrop-blur-sm text-white font-bold rounded-full transition-all flex items-center border border-white/20 shadow-lg ${isBookmarked ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800/80 hover:bg-gray-700'}`}
                            >
                                <Bookmark size={20} className={`mr-2 ${isBookmarked ? 'fill-current text-white' : 'text-yellow-500'}`} /> {isBookmarked ? "Saved" : "Bookmark"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1600px] mt-8 md:mt-16 lg:mt-32 relative z-20">
                {/* Cast Section */}
                {cast.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-sm block"></span>
                            Top Cast
                        </h2>
                        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                            {cast.map(actor => (
                                <div key={actor.id} className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] group/actor cursor-pointer relative">
                                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-gray-200 dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 relative flex items-center justify-center">
                                        {actor.profile_path && !actorImgErrors[actor.id] ? (
                                            <img
                                                src={`${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover group-hover/actor:scale-105 transition-transform duration-500 absolute inset-0"
                                                onError={() => setActorImgErrors(prev => ({ ...prev, [actor.id]: true }))}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-[#09090b] absolute inset-0 group-hover/actor:scale-105 transition-transform duration-500">
                                                <User size={48} className="opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent opacity-0 group-hover/actor:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                            <div className="translate-y-4 group-hover/actor:translate-y-0 transition-transform duration-300">
                                                <Link
                                                    to={`/person/${actor.id}`}
                                                    className="w-full py-1.5 bg-primary text-white text-xs font-bold rounded text-center hover:scale-105 block shadow-lg shadow-primary/20 pointer-events-auto"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-gray-900 dark:text-white text-sm font-medium leading-tight truncate">{actor.name}</h4>
                                    <p className="text-gray-500 text-xs truncate mt-1">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Movies */}
                {similar.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-sm block"></span>
                            Similar {isTV ? 'TV Shows' : 'Movies'}
                        </h2>
                        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-6 pt-2">
                            {similar.map(sim => (
                                <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px]" key={sim.id}>
                                    <MovieCard
                                        movie={{ ...sim, media_type: isTV ? 'tv' : 'movie' }}
                                        onTrailerClick={handleTrailerClick}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TrailerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                movieId={selectedTrailer.id}
                type={selectedTrailer.type}
            />
        </div>
    );
};

export default MovieDetail;
