import { createSlice } from '@reduxjs/toolkit';

const loadBookmarks = () => {
    try {
        const serialized = localStorage.getItem('movie_bookmarks');
        return serialized ? JSON.parse(serialized) : [];
    } catch (e) {
        return [];
    }
};

const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState: {
        items: loadBookmarks()
    },
    reducers: {
        addBookmark: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.unshift(action.payload);
                localStorage.setItem('movie_bookmarks', JSON.stringify(state.items));
            }
        },
        removeBookmark: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('movie_bookmarks', JSON.stringify(state.items));
        }
    }
});

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
