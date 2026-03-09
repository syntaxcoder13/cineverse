import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTrending, fetchPopular, fetchTopRated, fetchNowPlaying, fetchIndianMovies, fetchSouthIndianMovies } from '../redux/slices/movieSlice';
import { getPopularPeople } from '../utils/tmdb';
import MovieCard from '../components/MovieCard';
import { Play, Info, ChevronLeft, ChevronRight, Star, User, TrendingUp, Users } from 'lucide-react';
import TrailerModal from '../components/TrailerModal';

const HorizontalRow = ({ title, items, loading, onTrailerClick, icon: Icon, viewAllLink = "/movies" }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-14 relative group/row px-4 md:px-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-4">
                    {Icon && <Icon className="text-primary" size={28} />}
                    {title}
                </h2>
                <Link to={viewAllLink} className="text-primary text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1">
                    View All <ChevronRight size={14} />
                </Link>
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover/row:opacity-100 transition-all border border-white/10 shadow-2xl hover:bg-primary hover:text-white"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth"
                >
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[160px] md:w-[220px]">
                                <SkeletonCard />
                            </div>
                        ))
                        : items.map((item) => (
                            <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[220px]" key={item.id}>
                                {item.media_type === 'person' || (!item.title && !item.name && item.known_for) ? (
                                    <Link to={`/person/${item.id}`} className="group/actor block">
                                        <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden mb-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 shadow-md group-hover/actor:scale-105 transition-all duration-500">
                                            <img
                                                src={item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f19704e3adcc993791f3.svg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h4 className="text-gray-900 dark:text-white font-medium text-center text-sm truncate">{item.name}</h4>
                                    </Link>
                                ) : (
                                    <MovieCard
                                        movie={item}
                                        onTrailerClick={onTrailerClick}
                                    />
                                )}
                            </div>
                        ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white dark:bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-900 dark:text-white opacity-0 group-hover/row:opacity-100 transition-all border border-white/10 shadow-2xl hover:bg-primary hover:text-white"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

const Home = () => {
    const dispatch = useDispatch();
    const { trending, popular, topRated, nowPlaying, indian, southIndian, loading } = useSelector((state) => state.movie);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState({ id: null, type: 'movie' });
    const [heroIndex, setHeroIndex] = useState(0);
    const [people, setPeople] = useState([]);

    const heroMovies = trending?.slice(0, 5) || [];
    const heroMovie = heroMovies[heroIndex];

    useEffect(() => {
        dispatch(fetchTrending());
        dispatch(fetchPopular());
        dispatch(fetchTopRated());
        dispatch(fetchNowPlaying());
        dispatch(fetchIndianMovies());
        dispatch(fetchSouthIndianMovies());

        const fetchPeopleData = async () => {
            try {
                const data = await getPopularPeople(1);
                setPeople(data.results.slice(0, 10));
            } catch (err) {
                console.error(err);
            }
        };
        fetchPeopleData();
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [heroMovies.length]);

    const handleTrailerClick = (id, type) => {
        setSelectedMovie({ id, type });
        setModalOpen(true);
    };

    return (
        <div className="pb-20">
            {/* Hero Section - Optimized for all screens */}
            <div className="relative pt-20 md:pt-32 pb-6 md:pb-10 overflow-hidden">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[25/9] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl bg-[#111]">
                        {heroMovie && (
                            <>
                                <img
                                    src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path || heroMovie.poster_path}`}
                                    alt={heroMovie.title}
                                    className="w-full h-full object-cover md:object-center animate-fade-in transition-transform duration-1000 group-hover:scale-105"
                                    style={{ objectPosition: 'center top' }}
                                />
                                {/* Dynamic Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />

                                <div className="absolute top-4 left-4 md:top-10 md:left-10">
                                    <div className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-md text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                                        {heroMovie.media_type === 'tv' ? 'TV Series' : 'Cinematic'}
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-6 md:right-12">
                                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-black text-white mb-2 md:mb-4 leading-tight drop-shadow-2xl max-w-4xl">
                                        {heroMovie.title || heroMovie.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-3 md:gap-5 text-white/90 text-xs md:text-sm font-medium mb-5 md:mb-8">
                                        <div className="flex items-center gap-1.5 text-gold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                                            <Star size={14} className="fill-current" />
                                            <span className="font-bold">{heroMovie.vote_average.toFixed(1)}</span>
                                        </div>
                                        <span className="hidden sm:block opacity-40">•</span>
                                        <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded leading-none">
                                            {(heroMovie.release_date || heroMovie.first_air_date || '').substring(0, 4)}
                                        </span>
                                        <span className="hidden sm:block opacity-40">•</span>
                                        <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded leading-none uppercase tracking-wider">
                                            {heroMovie.original_language}
                                        </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                                        <button
                                            onClick={() => handleTrailerClick(heroMovie.id, heroMovie.media_type)}
                                            className="px-6 py-3.5 md:px-10 md:py-4 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-accent transition-all hover:scale-105 shadow-2xl shadow-primary/30 text-sm md:text-base"
                                        >
                                            <Play size={20} className="fill-current" /> Watch Trailer
                                        </button>
                                        <Link
                                            to={`/${heroMovie.media_type || 'movie'}/${heroMovie.id}`}
                                            className="px-6 py-3.5 md:px-10 md:py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-bold hover:bg-white/25 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            More Details
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mt-8">
                    {heroMovies.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setHeroIndex(idx)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${idx === heroIndex ? 'w-10 bg-primary' : 'w-4 bg-gray-300 dark:bg-gray-800'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Rows */}
            <div className="mt-10">
                <HorizontalRow
                    title="Trending Today"
                    items={trending}
                    loading={loading}
                    onTrailerClick={handleTrailerClick}
                    icon={TrendingUp}
                    viewAllLink="/trending"
                />
                <HorizontalRow title="Popular Hits" items={popular} loading={loading} onTrailerClick={handleTrailerClick} />

                <HorizontalRow
                    title="Popular People"
                    items={people}
                    loading={loading && people.length === 0}
                    viewAllLink="/people"
                    icon={Users}
                />

                <HorizontalRow title="Editor's Choice" items={topRated} loading={loading} onTrailerClick={handleTrailerClick} />
                <HorizontalRow title="New Releases" items={nowPlaying} loading={loading} onTrailerClick={handleTrailerClick} />
                <HorizontalRow title="Indian Cinema" items={indian} loading={loading} onTrailerClick={handleTrailerClick} />
            </div>

            <TrailerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                movieId={selectedMovie.id}
                type={selectedMovie.type}
            />
        </div>
    );
};

export default Home;
