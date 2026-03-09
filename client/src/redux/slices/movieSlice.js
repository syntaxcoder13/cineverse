import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrending, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getIndianMovies, getSouthIndianMovies } from '../../utils/tmdb';

export const fetchTrending = createAsyncThunk('movie/fetchTrending', async (_, thunkAPI) => {
    try {
        const data = await getTrending('movie', 'day');
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchPopular = createAsyncThunk('movie/fetchPopular', async (_, thunkAPI) => {
    try {
        const data = await getPopularMovies(1);
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchTopRated = createAsyncThunk('movie/fetchTopRated', async (_, thunkAPI) => {
    try {
        const data = await getTopRatedMovies(1);
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchNowPlaying = createAsyncThunk('movie/fetchNowPlaying', async (_, thunkAPI) => {
    try {
        const data = await getNowPlayingMovies(1);
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchIndianMovies = createAsyncThunk('movie/fetchIndianMovies', async (_, thunkAPI) => {
    try {
        const data = await getIndianMovies(1);
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchSouthIndianMovies = createAsyncThunk('movie/fetchSouthIndianMovies', async (_, thunkAPI) => {
    try {
        const data = await getSouthIndianMovies(1);
        return data.results;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        trending: [],
        popular: [],
        topRated: [],
        nowPlaying: [],
        indian: [],
        southIndian: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrending.fulfilled, (state, action) => { state.trending = action.payload; })
            .addCase(fetchPopular.fulfilled, (state, action) => { state.popular = action.payload; })
            .addCase(fetchTopRated.fulfilled, (state, action) => { state.topRated = action.payload; })
            .addCase(fetchNowPlaying.fulfilled, (state, action) => { state.nowPlaying = action.payload; })
            .addCase(fetchIndianMovies.fulfilled, (state, action) => { state.indian = action.payload; })
            .addCase(fetchSouthIndianMovies.fulfilled, (state, action) => { state.southIndian = action.payload; });
    },
});

export default movieSlice.reducer;
