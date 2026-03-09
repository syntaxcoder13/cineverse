import { useSelector, useDispatch } from 'react-redux';
import { BookmarkMinus } from 'lucide-react';
import { removeBookmark } from '../redux/slices/bookmarkSlice';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
    const dispatch = useDispatch();
    const { items: bookmarks } = useSelector((state) => state.bookmarks);

    const handleRemove = (id) => {
        dispatch(removeBookmark(id));
    };

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <h1 className="text-3xl md:text-5xl font-bebas text-gray-900 dark:text-white tracking-wide flex items-center gap-3 mb-8">
                <span className="w-1.5 h-8 md:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-sm block"></span>
                My Bookmarks
            </h1>

            {bookmarks.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800">
                    <BookmarkMinus size={48} className="mx-auto text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No bookmarks found.</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Bookmark your favorite content to find it faster.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                    {bookmarks.map((fav) => (
                        <div key={fav.id} className="group relative rounded-xl overflow-hidden bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 hover:scale-105 transition-transform duration-300">
                            <div className="aspect-[2/3] w-full">
                                <img
                                    src={fav.poster_path ? (fav.poster_path.startsWith('http') ? fav.poster_path : `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${fav.poster_path}`) : '/placeholder-movie.png'}
                                    alt={fav.title || fav.name}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
                                    <Link
                                        to={`/${fav.media_type === 'tv' ? 'tv' : 'movie'}/${fav.id}`}
                                        className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded text-center hover:scale-105 hover:shadow-pink-500/50 block"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(fav.id)}
                                        className="w-full py-1.5 bg-gray-800 text-red-500 text-xs font-bold rounded hover:bg-gray-700 border border-red-500/30"
                                    >
                                        Remove Bookmark
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                <h3 className="text-white font-medium text-sm truncate">{fav.title || fav.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
