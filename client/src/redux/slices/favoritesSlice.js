import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, thunkAPI) => {
    try {
        const response = await api.get('/favorites');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
});

export const addFavorite = createAsyncThunk('favorites/addFavorite', async (movieData, thunkAPI) => {
    try {
        const response = await api.post('/favorites', movieData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
});

export const removeFavorite = createAsyncThunk('favorites/removeFavorite', async (movieId, thunkAPI) => {
    try {
        await api.delete(`/favorites/${movieId}`);
        return movieId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
});

const initialState = {
    favorites: [],
    loading: false,
    error: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.favorites = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favorites.unshift(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter(
                    (f) => String(f.movieId) !== String(action.payload)
                );
            });
    },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
