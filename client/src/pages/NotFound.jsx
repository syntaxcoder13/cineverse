import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050508] text-gray-900 dark:text-white px-4 text-center">
            <h1 className="text-9xl font-serif font-black text-primary mb-4 text-shadow-lg">404</h1>
            <h2 className="text-3xl font-serif font-bold mb-6 italic uppercase tracking-widest">Lost in the multiverse</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                The page you're looking for seems to have slipped through a wormhole.
                Don't worry, you can always go back to the familiar dimension.
            </p>
            <Link
                to="/"
                className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-accent transition-all shadow-lg shadow-primary/20 scale-100 hover:scale-105"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
