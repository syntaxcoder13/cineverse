import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-[#050508] p-4">
            {/* Background with blur */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original/9yBVqNruk6Ykrwc32qrK2TIE5xw.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent z-0" />

            <div className="relative z-10 w-full max-w-md p-8 md:p-12 bg-[#09090b]/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-10">
                    <Link to="/" className="text-3xl md:text-4xl font-serif font-black tracking-tighter text-white italic">
                        Cine<span className="text-primary">Verse</span>
                    </Link>
                    <h2 className="text-2xl font-serif font-bold mt-8 text-white">Welcome Back</h2>
                    <p className="text-gray-400 text-sm mt-2">Sign in to continue your cinematic journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-sm text-center animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-xs font-bold uppercase tracking-widest mb-2 px-1" htmlFor="email">Email or Username</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all placeholder:text-gray-600"
                            placeholder="Email or username"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 px-1">
                            <label className="block text-gray-300 text-xs font-bold uppercase tracking-widest" htmlFor="password">Password</label>
                            <a href="#" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 flex justify-center items-center mt-4 text-sm uppercase tracking-widest"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center text-gray-400 text-xs uppercase tracking-widest">
                    New to CineVerse?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-bold">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
