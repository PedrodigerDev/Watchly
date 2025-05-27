const TMDB_API_KEY = 'd0629388a91b8c64fa792bb0988fa654';
const BASE_URL = 'https://api.themoviedb.org/3';
const ANILIST_API = 'https://graphql.anilist.co';


export const fetchTrending = async (type = 'movie') => {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const fetchMediaByGenre = async (type, genreId, sort = 'popularity.desc') => {
  const res = await fetch(
    `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=${sort}`
  );
  const data = await res.json();
  return data.results || [];
};

export const fetchAnimeGenres = async () => {
  return ['Action', 'Comedy', 'Drama', 'Romance', 'Adventure'];
};

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

export const searchTMDB = async (query, type = 'movie') => {
  const res = await fetch(
    `${BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results || [];
};

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