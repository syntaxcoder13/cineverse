import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export const getTrending = async (mediaType = 'all', timeWindow = 'day', page = 1) => {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } });
    return response.data;
};

export const getPopularMovies = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/popular`, { params: { page } });
    return response.data;
};

export const getTopRatedMovies = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/top_rated`, { params: { page } });
    return response.data;
};

export const getNowPlayingMovies = async (page = 1) => {
    const response = await tmdbApi.get(`/movie/now_playing`, { params: { page } });
    return response.data;
};

export const getIndianMovies = async (page = 1) => {
    const response = await tmdbApi.get(`/discover/movie`, {
        params: {
            with_original_language: 'hi',
            sort_by: 'popularity.desc',
            page
        }
    });
    return response.data;
};

export const getSouthIndianMovies = async (page = 1) => {
    const response = await tmdbApi.get(`/discover/movie`, {
        params: {
            with_original_language: 'te|ta|ml|kn',
            sort_by: 'popularity.desc',
            page
        }
    });
    return response.data;
};

export const getMovieDetails = async (movieId) => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { append_to_response: 'videos,credits,similar' }
    });
    return response.data;
};

export const searchMulti = async (query, page = 1) => {
    const response = await tmdbApi.get(`/search/multi`, { params: { query, page } });
    return response.data;
};

export const exploreMovies = async (genre, sortBy, page = 1) => {
    const response = await tmdbApi.get(`/discover/movie`, {
        params: {
            with_genres: genre,
            sort_by: sortBy,
            page
        }
    });
    return response.data;
};

export const exploreTV = async (genre, sortBy, page = 1) => {
    const response = await tmdbApi.get(`/discover/tv`, {
        params: {
            with_genres: genre,
            sort_by: sortBy,
            page
        }
    });
    return response.data;
};

export const getPopularTVShows = async (page = 1) => {
    const response = await tmdbApi.get(`/tv/popular`, { params: { page } });
    return response.data;
};

export const getTVShowDetails = async (tvId) => {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
        params: { append_to_response: 'videos,credits,similar' }
    });
    return response.data;
};

export const getPopularPeople = async (page = 1) => {
    const response = await tmdbApi.get(`/person/popular`, { params: { page } });
    return response.data;
};

export const getPersonDetails = async (personId) => {
    const response = await tmdbApi.get(`/person/${personId}`, {
        params: { append_to_response: 'movie_credits,tv_credits' }
    });
    return response.data;
};
