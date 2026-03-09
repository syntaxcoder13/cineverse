import { useState } from 'react';

import { Star, Play, Info, Image as ImageIcon, Heart, Bookmark, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { addBookmark, removeBookmark } from '../redux/slices/bookmarkSlice';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';

const MovieCard = ({ movie, onTrailerClick }) => {
    const dispatch = useDispatch();
    const [imgError, setImgError] = useState(false);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const watchlist = useSelector(state => state.watchlist.items);
    const bookmarks = useSelector(state => state.bookmarks.items);
    const favorites = useSelector(state => state.favorites.favorites);

    const isWatchlisted = watchlist.some(item => item.id === movie.id);
    const isBookmarked = bookmarks.some(item => item.id === movie.id);
    const isFavorited = favorites.some(item => String(item.movieId) === String(movie.id) || item.id === movie.id);

    const posterUrl = movie.poster_path
        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${movie.poster_path}`)
        : null;

    const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);

    const handleWatchlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return alert('Please login to manage watchlist');
        if (isWatchlisted) {
            dispatch(removeFromWatchlist(movie.id));
        } else {
            dispatch(addToWatchlist(movie));
        }
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return alert('Please login to bookmark items');
        if (isBookmarked) {
            dispatch(removeBookmark(movie.id));
        } else {
            dispatch(addBookmark(movie));
        }
    };

    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return alert('Please login to manage favorites');

        if (isFavorited) {
            dispatch(removeFavorite(movie.id.toString()));
        } else {
            dispatch(addFavorite({
                movieId: movie.id.toString(),
                title: movie.title || movie.name,
                poster: movie.poster_path,
                rating: movie.vote_average
            }));
        }
    };

    return (
        <div className="group/card relative flex flex-col w-full h-full mb-4">
            {/* Poster Container */}
            <div className="relative aspect-[2/3] w-full rounded-[14px] overflow-hidden bg-gray-200 dark:bg-[#111] transition-all duration-500 group-hover/card:scale-[1.03] group-hover/card:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {posterUrl && !imgError ? (
                    <img
                        src={posterUrl}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                        <ImageIcon size={40} className="mb-2 opacity-20" />
                        <span className="text-[10px] uppercase tracking-widest text-center">{movie.title || movie.name}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {movie.vote_average > 0 && (
                        <div className="bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/10">
                            <Star size={10} className="text-[#f5c518] fill-[#f5c518]" />
                            <span className="text-white text-[11px] font-bold">{movie.vote_average.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <div className="absolute top-3 right-3">
                    <div className="bg-primary/90 rounded-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {movie.media_type === 'tv' ? 'TV' : 'Movie'}
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTrailerClick && onTrailerClick(movie.id, movie.media_type || 'movie'); }}
                        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-all duration-300 scale-75 group-hover/card:scale-100 mb-4 shadow-lg shadow-primary/20"
                    >
                        <Play size={20} className="fill-current ml-1" />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFavoriteToggle}
                            className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 ${isFavorited ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        >
                            <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
                        </button>
                        <button
                            onClick={handleWatchlist}
                            className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 ${isWatchlisted ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                            <Eye size={16} className={isWatchlisted ? 'fill-current' : ''} />
                        </button>
                        <button
                            onClick={handleBookmark}
                            className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                        >
                            <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                        <RouterLink
                            to={`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                            title="View Details"
                        >
                            <Info size={16} />
                        </RouterLink>
                    </div>
                </div>
            </div>

            {/* Movie Info */}
            <div className="mt-4 text-center px-1">
                <h3 className="text-gray-900 dark:text-white font-serif font-bold text-sm md:text-md truncate mb-1">
                    {movie.title || movie.name}
                </h3>
                <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium tracking-widest">
                    {year}
                </span>
            </div>
        </div>
    );
};

export default MovieCard;
