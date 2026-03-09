# CineVerse | Premium Movie Platform

CineVerse is a full-stack movie discovery platform with a sleek, cinematic, dark-themed UI. It uses the TMDB API to fetch dynamic movie and TV show data, features full user authentication, allows users to keep track of their watch history and favorites, and includes a protected Admin dashboard.

## Features

- **Frontend:** React.js, Redux Toolkit, Redux Thunks, React Router v6, Axios, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Auth, bcryptjs
- **Highlights:**
  - Real-time Debounced Search (Movies, TV Shows, People)
  - Infinite Scrolling with IntersectionObserver
  - Embedded YouTube Trailers
  - Custom user favorites and watch history synchronized with MongoDB
  - Admin Dashboard for local movie management and user banning

## Prerequisites

- Node.js installed
- MongoDB URI
- TMDB API Key (Register at [TMDB](https://www.themoviedb.org/documentation/api))

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env` file in the `client` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/original
VITE_BACKEND_URL=http://localhost:5000/api
```

## Setup & Running

**1. Backend Setup**
```bash
cd server
npm install
node seed.js    # Creates initial admin user (admin@cineverse.com / Admin@123)
node server.js  # Starts the server on port 5000
```

**2. Frontend Setup**
```bash
cd client
npm install
npm run dev     # Starts the Vite dev server
```

## Admin User

A seed script (`server/seed.js`) has been provided. By running `node seed.js` in the server directory, a default admin is created:
**Email:** admin@cineverse.com
**Password:** Admin@123
