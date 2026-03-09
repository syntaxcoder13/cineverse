import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#09090b] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                <Film size={24} />
                            </div>
                            <span className="text-2xl font-serif font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                                Cine<span className="text-primary">Verse</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-muted leading-relaxed">
                            Discover the world of cinema with CineVerse. Your ultimate destination for movies, TV shows, and everything in between.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-widest">Navigation</h3>
                        <ul className="flex flex-col gap-4">
                            {['Home', 'Movies', 'TV Shows', 'People', 'Search'].map((link) => (
                                <li key={link}>
                                    <Link
                                        to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`}
                                        className="text-gray-500 dark:text-muted hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-widest">Categories</h3>
                        <ul className="flex flex-col gap-4">
                            {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'].map((genre) => (
                                <li key={genre}>
                                    <Link
                                        to={`/movies`}
                                        className="text-gray-500 dark:text-muted hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        {genre}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-serif font-bold text-lg mb-6 uppercase tracking-widest">Contact</h3>
                        <ul className="flex flex-col gap-4 text-gray-500 dark:text-muted">
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary" />
                                <span>support@cineverse.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-primary" />
                                <span>123 Movie Lane, Cinema City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 dark:text-muted text-sm">
                    <p>© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
