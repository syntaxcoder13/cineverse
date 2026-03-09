import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Menu, X } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Force dark theme for cinematic aesthetic
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-4 md:px-10 flex justify-between items-center font-sans">
                {/* Logo */}
                <Link to="/" className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white italic font-bold">
                    CineVerse
                </Link>

                {/* Desktop Menu - Centered links */}
                <div className="hidden lg:flex items-center space-x-10 uppercase text-[13px] font-semibold tracking-widest absolute left-1/2 -translate-x-1/2">
                    <Link to="/" className={`${isActive('/') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary transition-colors`}>Home</Link>
                    <Link to="/movies" className={`${isActive('/movies') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary transition-colors`}>Movies</Link>
                    <Link to="/tv" className={`${isActive('/tv') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary transition-colors`}>TV Shows</Link>
                    <Link to="/trending" className={`${isActive('/trending') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary transition-colors`}>Trending</Link>
                    <Link to="/people" className={`${isActive('/people') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} hover:text-primary transition-colors`}>People</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-6">
                    <Link to="/search" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                        <Search size={20} />
                    </Link>

                    {isAuthenticated ? (
                        <div className="group relative">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] py-3 hidden group-hover:block transition-all duration-300 transform origin-top-right animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-white/10 mb-2">
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Account</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username}</p>
                                </div>
                                <Link to="/favorites" className="flex items-center space-x-3 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span>My Favorites</span>
                                </Link>
                                <Link to="/watchlist" className="flex items-center space-x-3 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span>Watchlist</span>
                                </Link>
                                <Link to="/bookmarks" className="flex items-center space-x-3 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span>Saved Bookmarks</span>
                                </Link>
                                <Link to="/history" className="flex items-center space-x-3 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span>Watch History</span>
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center space-x-3 px-4 py-2.5 text-[13px] text-accent font-bold hover:bg-accent/10 transition-colors border-t border-gray-100 dark:border-white/10 mt-2">
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-colors">Sign Out</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-5">
                            <Link to="/login" className="hidden md:block text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden md:block px-6 py-2 bg-primary text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-accent transition-all hover:scale-105 shadow-lg shadow-primary/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-900 dark:text-white">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-[#000000] fixed inset-0 z-[60] flex flex-col items-center justify-center space-y-8 text-xl font-serif">
                    <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-900 dark:text-white">
                        <X size={32} />
                    </button>
                    <Link to="/" className={isActive('/') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/movies" className={isActive('/movies') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} onClick={() => setMobileMenuOpen(false)}>Movies</Link>
                    <Link to="/tv" className={isActive('/tv') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} onClick={() => setMobileMenuOpen(false)}>TV Shows</Link>
                    <Link to="/trending" className={isActive('/trending') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} onClick={() => setMobileMenuOpen(false)}>Trending</Link>
                    <Link to="/people" className={isActive('/people') ? 'text-primary' : 'text-gray-600 dark:text-gray-300'} onClick={() => setMobileMenuOpen(false)}>People</Link>

                    {isAuthenticated ? (
                        <>
                            <div className="w-full border-t border-gray-100 dark:border-white/10 my-4" />
                            <Link to="/favorites" className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>My Favorites</Link>
                            <Link to="/watchlist" className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Watchlist</Link>
                            <Link to="/bookmarks" className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Bookmarks</Link>
                            <Link to="/history" className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>History</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-accent font-bold" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                            )}
                            <button
                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                className="text-red-500 font-bold pt-4"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Link to="/login" className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="px-10 py-3 bg-primary text-white rounded-full text-sm font-bold uppercase" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
