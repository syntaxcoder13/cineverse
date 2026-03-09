import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Film, Users, PlusCircle, Trash2, Ban, Edit, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('movies');
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', poster: '', description: '', movieId: '', releaseDate: '',
        trailerLink: '', genre: '', category: 'movie'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'movies') {
                const res = await api.get('/admin/movies');
                setMovies(res.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'movies' || activeTab === 'users') {
            fetchData();
        }
    }, [activeTab]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/movies', {
                ...formData,
                genre: formData.genre.split(',').map(g => g.trim())
            });
            alert('Movie added successfully');
            setFormData({ title: '', poster: '', description: '', movieId: '', releaseDate: '', trailerLink: '', genre: '', category: 'movie' });
            setActiveTab('movies');
        } catch (err) {
            console.error(err);
            alert('Error adding movie');
        }
    };

    const handleDeleteMovie = async (id) => {
        if (window.confirm('Delete this movie?')) {
            try {
                await api.delete(`/admin/movies/${id}`);
                setMovies(movies.filter(m => m._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleBanUser = async (id) => {
        try {
            const res = await api.put(`/admin/users/${id}/ban`);
            setUsers(users.map(u => u._id === id ? res.data : u));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user permanently?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050508] pt-20 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-[#09090b] border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col h-auto md:h-[calc(100vh-80px)] md:sticky md:top-20">
                <h2 className="text-2xl font-bebas text-gray-900 dark:text-white tracking-wide mb-8">Admin Panel</h2>
                <nav className="flex flex-row md:flex-col gap-4">
                    <button
                        onClick={() => setActiveTab('movies')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'movies' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Film size={20} /> <span className="hidden md:inline">Movies</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'users' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Users size={20} /> <span className="hidden md:inline">Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'add' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <PlusCircle size={20} /> <span className="hidden md:inline">Add Movie/TV</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Movies Created</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{activeTab === 'movies' ? movies.length : '--'}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <Film size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{activeTab === 'users' ? users.length : '--'}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#18181b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Banned Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{activeTab === 'users' ? users.filter(u => u.isBanned).length : '--'}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <Ban size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-10 flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border border-pink-500"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'movies' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white dark:bg-[#09090b] border-b border-gray-200 dark:border-gray-800">
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Movie</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Category</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Release Date</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {movies.length === 0 ? (
                                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No movies found</td></tr>
                                            ) : (
                                                movies.map(movie => (
                                                    <tr key={movie._id} className="hover:bg-gray-800/50 transition-colors">
                                                        <td className="p-4 flex items-center gap-4">
                                                            <img src={movie.poster || '/placeholder-movie.png'} alt={movie.title} className="w-12 h-16 object-cover rounded bg-gray-800" />
                                                            <span className="text-gray-900 dark:text-white font-medium">{movie.title}</span>
                                                        </td>
                                                        <td className="p-4 text-gray-700 dark:text-gray-300 uppercase text-xs">{movie.category}</td>
                                                        <td className="p-4 text-gray-700 dark:text-gray-300">{movie.releaseDate}</td>
                                                        <td className="p-4">
                                                            <button onClick={() => handleDeleteMovie(movie._id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-gray-900 dark:text-white transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white dark:bg-[#09090b] border-b border-gray-200 dark:border-gray-800">
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">User</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Email</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Role</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Status</th>
                                                <th className="p-4 text-gray-600 dark:text-gray-400 font-medium font-sm">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {users.length === 0 ? (
                                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found</td></tr>
                                            ) : (
                                                users.map(user => (
                                                    <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                                                        <td className="p-4">
                                                            <div className="text-gray-900 dark:text-white font-medium">{user.username}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            {user.isBanned ? (
                                                                <span className="flex items-center text-red-500 text-sm font-medium"><Ban size={14} className="mr-1" /> Banned</span>
                                                            ) : (
                                                                <span className="flex items-center text-green-500 text-sm font-medium"><CheckCircle size={14} className="mr-1" /> Active</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 flex gap-2">
                                                            <button
                                                                onClick={() => handleBanUser(user._id)}
                                                                className={`p-2 rounded transition-colors ${user.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                                                                title={user.isBanned ? "Unban User" : "Ban User"}
                                                            >
                                                                {user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-gray-900 dark:text-white transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'add' && (
                                <div className="p-6 md:p-8 w-full max-w-3xl mx-auto">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Title manually</h3>
                                    <form onSubmit={handleAddMovie} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Title *</label>
                                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Movie / TV ID</label>
                                                <input type="text" name="movieId" value={formData.movieId} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500" placeholder="TMDB ID if applicable" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Category *</label>
                                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500">
                                                    <option value="movie">Movie</option>
                                                    <option value="tv">TV Show</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Release Date</label>
                                                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500 [color-scheme:dark]" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Poster Image URL</label>
                                                <input type="url" name="poster" value={formData.poster} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500" placeholder="https://..." />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Trailer YouTube Link</label>
                                                <input type="text" name="trailerLink" value={formData.trailerLink} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500" placeholder="e.g. https://www.youtube.com/watch?v=..." />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Genres (Comma separated)</label>
                                                <input type="text" name="genre" value={formData.genre} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500" placeholder="Action, Thriller, Sci-Fi" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Description</label>
                                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-3 bg-white dark:bg-[#09090b] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-pink-500 resize-none"></textarea>
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900 dark:text-white font-bold rounded-lg hover:scale-105 hover:shadow-pink-500/50 transition-colors shadow-lg shadow-pink-500/20">
                                            Save to Database
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
