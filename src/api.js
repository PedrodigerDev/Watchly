const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const ANILIST_API = 'https://graphql.anilist.co';

// 🔥 Trending movies, shows, or anime
export const fetchTrending = async (type = 'movie') => {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

// 🔍 Search TMDB (movies/shows)
export const searchTMDB = async (query, type = 'movie') => {
  const res = await fetch(
    `${BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results || [];
};

// 🔍 Search AniList (anime)
export const searchAnilist = async (query) => {
  const queryStr = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title { romaji }
        coverImage { large }
      }
    }`;
  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queryStr, variables: { search: query } }),
  });
  const json = await res.json();
  return json.data.Media ? [json.data.Media] : [];
};

// 🎭 Discover TMDB content by genre
export const fetchMediaByGenre = async (type, genreId, sort = 'popularity.desc') => {
  const res = await fetch(
    `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=${sort}`
  );
  const data = await res.json();
  return data.results || [];
};

// 📺 Discover anime by genre (AniList)
export const fetchAnimeByGenre = async (genre) => {
  const query = `
    query ($genre: String) {
      Page(perPage: 50) {
        media(genre_in: [$genre], type: ANIME) {
          id
          title { romaji }
          coverImage { large, extraLarge }
        }
      }
    }`;
  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { genre } }),
  });
  const json = await res.json();
  return json.data.Page.media || [];
};

// 🎨 Genre list for anime
export const fetchAnimeGenres = async () => {
  return ['Action', 'Comedy', 'Drama', 'Romance', 'Adventure', 'Fantasy'];
};

// 🎞️ Get TMDB recommendations (for similar titles)
export const fetchSimilarTitles = async (id, type) => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

// 📅 Calendar: get airing today TV shows
export const fetchAiringTodayTV = async () => {
  const res = await fetch(`${BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

// 🧠 Genre Explorer (full genre discovery)
export const fetchAllByGenre = async (genreId, type = 'movie', page = 1) => {
  const res = await fetch(
    `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await res.json();
  return data.results || [];
};
