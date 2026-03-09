import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, History, Clock } from 'lucide-react';
import { fetchHistory, clearHistory } from '../redux/slices/watchHistorySlice';
import { Link } from 'react-router-dom';

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    if (diffInMins < 60) return `${diffInMins} minutes ago`;

    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `1 day ago`;
    if (diffInDays < 30) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
};

const WatchHistory = () => {
    const dispatch = useDispatch();
    const { history, loading } = useSelector((state) => state.watchHistory);

    useEffect(() => {
        dispatch(fetchHistory());
        window.scrollTo(0, 0);
    }, [dispatch]);

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear your entire watch history?')) {
            dispatch(clearHistory());
        }
    };

    if (loading && history.length === 0) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-5xl font-bebas text-gray-900 dark:text-white tracking-wide flex items-center gap-3">
                    <span className="w-1.5 h-8 md:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-sm block"></span>
                    Watch History
                </h1>

                {history.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-gray-900 dark:text-white transition-colors"
                    >
                        <Trash2 size={16} /> Clear History
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800">
                    <History size={48} className="mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No history to display</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Movies and shows you check out will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {history.map((item) => (
                        <Link
                            to={`/movie/${item.movieId}`}
                            key={item._id}
                            className="flex items-center gap-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-pink-500/50 transition-colors group p-3"
                        >
                            <div className="w-16 h-24 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                                <img
                                    src={item.poster ? (item.poster.startsWith('http') ? item.poster : `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w92'}${item.poster}`) : '/placeholder-movie.png'}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col flex-1 justify-center">
                                <h3 className="text-gray-900 dark:text-white font-medium text-lg leading-tight mb-2 group-hover:text-pink-500 transition-colors">{item.title}</h3>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    Watched {formatTimeAgo(item.watchedAt)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchHistory;
