import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getMovieDetails, getTVShowDetails } from '../utils/tmdb';
import api from '../utils/api';

const TrailerModal = ({ isOpen, onClose, movieId, type = 'movie' }) => {
    const [trailerKey, setTrailerKey] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && movieId) {
            const fetchTrailer = async () => {
                setLoading(true);
                try {
                    let data;
                    const isLocalMovie = /^[0-9a-fA-F]{24}$/.test(movieId);

                    if (isLocalMovie) {
                        const res = await api.get(`/movies/${movieId}`);
                        data = res.data;
                    } else {
                        data = type === 'tv' ? await getTVShowDetails(movieId) : await getMovieDetails(movieId);
                    }

                    const videos = data.videos?.results || [];
                    const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');
                    if (trailer) {
                        setTrailerKey(trailer.key);
                    } else {
                        setTrailerKey(null);
                    }
                } catch (error) {
                    console.error('Error fetching trailer', error);
                    setTrailerKey(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchTrailer();
        } else {
            setTrailerKey(null);
        }
    }, [isOpen, movieId, type]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl aspect-video bg-white dark:bg-[#09090b] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-200 dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center rounded-full text-gray-900 dark:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
                    </div>
                ) : trailerKey ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                        title="Trailer"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <p className="text-xl">Trailer for this title is currently unavailable.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrailerModal;
