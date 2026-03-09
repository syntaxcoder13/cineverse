import { createSlice } from '@reduxjs/toolkit';

const loadWatchlist = () => {
    try {
        const serialized = localStorage.getItem('movie_watchlist');
        return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
        return [];
    }
};

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState: {
        items: loadWatchlist()
    },
    reducers: {
        addToWatchlist: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.unshift(action.payload);
                localStorage.setItem('movie_watchlist', JSON.stringify(state.items));
            }
        },
        removeFromWatchlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('movie_watchlist', JSON.stringify(state.items));
        }
    }
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
