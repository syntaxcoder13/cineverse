import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetails } from '../utils/tmdb';
import MovieCard from '../components/MovieCard';

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            setLoading(true);
            try {
                const data = await getPersonDetails(id);
                setPerson(data);
            } catch (error) {
                console.error('Error fetching person details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerson();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border border-pink-500"></div>
            </div>
        );
    }

    if (!person) return <div className="pt-32 text-center text-gray-900 dark:text-white text-2xl">Person not found</div>;

    const credits = [...(person.movie_credits?.cast || []), ...(person.tv_credits?.cast || [])]
        .filter(item => item.poster_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20); // Top 20 known for

    return (
        <div className="pt-24 md:pt-32 pb-20 bg-gray-50 dark:bg-[#050508] min-h-screen container mx-auto px-4 md:px-8 lg:px-12 max-w-[1600px]">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Profile Image */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl shadow-pink-500/20 bg-white dark:bg-[#18181b]">
                        <img
                            src={person.profile_path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${person.profile_path}` : '/placeholder-person.png'}
                            alt={person.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col text-gray-900 dark:text-white">
                    <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">{person.name}</h1>
                    <p className="text-pink-500 font-medium mb-6 text-lg">{person.known_for_department}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 mb-8 text-sm">
                        {person.birthday && (
                            <div>
                                <p className="text-gray-500">Born</p>
                                <p className="font-medium">{person.birthday}</p>
                            </div>
                        )}
                        {person.place_of_birth && (
                            <div>
                                <p className="text-gray-500">Place of Birth</p>
                                <p className="font-medium truncate">{person.place_of_birth}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-gray-500">Popularity</p>
                            <p className="font-medium">{person.popularity?.toFixed(1)}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bebas mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-sm block"></span>
                            Biography
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl whitespace-pre-wrap">
                            {person.biography || "No biography available."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Known For */}
            {credits.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bebas mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-sm block"></span>
                        Known For
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                        {credits.map((item, index) => (
                            <MovieCard key={`${item.id}-${index}`} movie={{ ...item, media_type: item.title ? 'movie' : 'tv' }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonDetail;
