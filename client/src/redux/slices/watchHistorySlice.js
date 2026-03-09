import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchHistory = createAsyncThunk('watchHistory/fetchHistory', async (_, thunkAPI) => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
});

export const addToHistory = createAsyncThunk('watchHistory/addToHistory', async (movieData, thunkAPI) => {
    try {
        const response = await api.post('/history', movieData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to history');
    }
});

export const clearHistory = createAsyncThunk('watchHistory/clearHistory', async (_, thunkAPI) => {
    try {
        await api.delete('/history');
        return [];
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to clear history');
    }
});

const initialState = {
    history: [],
    loading: false,
};

const watchHistorySlice = createSlice({
    name: 'watchHistory',
    initialState,
    reducers: {
        clearHistoryState: (state) => {
            state.history = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistory.pending, (state) => { state.loading = true; })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchHistory.rejected, (state) => { state.loading = false; })
            .addCase(addToHistory.fulfilled, (state, action) => {
                // Remove if exists to move to top
                state.history = state.history.filter((h) => h.movieId !== action.payload.movieId);
                state.history.unshift(action.payload);
            })
            .addCase(clearHistory.fulfilled, (state) => { state.history = []; });
    },
});

export const { clearHistoryState } = watchHistorySlice.actions;
export default watchHistorySlice.reducer;
