import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPopularPeople } from '../utils/tmdb';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const People = () => {
    const [people, setPeople] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchPeople = async (pageNum) => {
        setLoading(true);
        try {
            const data = await getPopularPeople(pageNum);
            if (pageNum === 1) {
                setPeople(data.results);
            } else {
                setPeople(prev => [...prev, ...data.results]);
            }
            setHasMore(data.page < data.total_pages);
        } catch (error) {
            console.error('Error fetching people:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople(page);
        window.scrollTo(0, 0);
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const next = page + 1;
            setPage(next);
            fetchPeople(next);
        }
    }, [loading, hasMore, page]);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white tracking-wide flex items-center gap-3 mb-8">
                <span className="w-1.5 h-8 md:h-10 bg-primary rounded-sm block"></span>
                Popular People
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                {people.map((person, index) => (
                    <div key={`${person.id}-${index}`} className="group/person cursor-pointer">
                        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] mb-3 relative shadow-lg">
                            <img
                                src={person.profile_path ? `${import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p/w500'}${person.profile_path}` : '/placeholder-person.png'}
                                alt={person.name}
                                loading="lazy"
                                className="w-full h-full object-cover transform group-hover/person:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay with known for */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent opacity-0 group-hover/person:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <div className="translate-y-4 group-hover/person:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
                                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                                        Known for: {person.known_for?.map(k => k.title || k.name).join(', ')}
                                    </p>
                                    <Link
                                        to={`/person/${person.id}`}
                                        className="w-full py-1.5 bg-primary text-gray-900 dark:text-white text-xs font-bold rounded text-center hover:scale-105 block shadow-lg shadow-primary/20"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-medium text-center">{person.name}</h3>
                        <p className="text-gray-500 text-xs text-center truncate">{person.known_for_department}</p>
                    </div>
                ))}

                {loading && Array.from({ length: 12 }).map((_, i) => (
                    <div key={`skel-${i}`} className="animate-pulse">
                        <div className="w-full aspect-[2/3] bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                ))}
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
        </div>
    );
};

export default People;
