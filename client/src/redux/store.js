import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import favoritesReducer from './slices/favoritesSlice';
import watchHistoryReducer from './slices/watchHistorySlice';
import watchlistReducer from './slices/watchlistSlice';
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        movie: movieReducer,
        favorites: favoritesReducer,
        watchHistory: watchHistoryReducer,
        watchlist: watchlistReducer,
        bookmarks: bookmarkReducer,
    },
});
