// src/api.js
const TMDB_API_KEY = 'd0629388a91b8c64fa792bb0988fa654';
const BASE_URL = 'https://api.themoviedb.org/3';
const ANILIST_URL = 'https://graphql.anilist.co';

export const fetchTrending = async (type = 'movie') => {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const fetchAllByGenre = async (type, genreIdOrName) => {
  if (type === 'anime') return fetchAnimeByGenre(genreIdOrName);
  const url = `${BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreIdOrName}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
};

export const fetchAnimeByGenre = async (genreName) => {
  const query = `
    query ($genre: String) {
      Page(perPage: 20) {
        media(genre_in: [$genre], type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
          isAdult
        }
      }
    }
  `;
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { genre: genreName } })
  });
  const json = await res.json();
  return json.data?.Page?.media || [];
};

export const searchTMDB = async (type, query) => {
  const url = `${BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
};

export const searchAnilist = async (query) => {
  const gqlQuery = `
    query ($search: String) {
      Page(perPage: 20) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
          isAdult
        }
      }
    }
  `;
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: gqlQuery, variables: { search: query } })
  });
  const json = await res.json();
  return json.data?.Page?.media || [];
};

export const fetchMediaDetails = async (type, id) => {
  if (type === 'anime') {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
          isAdult
          episodes
        }
      }
    `;
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } })
    });
    const json = await res.json();
    const media = json.data?.Media || null;

    // Add fallback rating
    return {
      ...media,
      rating: media?.isAdult ? '18+' : 'NR'
    };
  } else {
    const detailRes = await fetch(`${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`);
    const detailData = await detailRes.json();

    let rating = 'NR';

    if (type === 'movie') {
      const certRes = await fetch(`${BASE_URL}/movie/${id}/release_dates?api_key=${TMDB_API_KEY}`);
      const certData = await certRes.json();
      const us = certData.results?.find(r => r.iso_3166_1 === 'US');
      rating = us?.release_dates?.[0]?.certification || 'NR';
    } else if (type === 'tv') {
      const ratingRes = await fetch(`${BASE_URL}/tv/${id}/content_ratings?api_key=${TMDB_API_KEY}`);
      const ratingData = await ratingRes.json();
      const us = ratingData.results?.find(r => r.iso_3166_1 === 'US');
      rating = us?.rating || 'NR';
    }

    return {
      ...detailData,
      rating
    };
  }
};

export const fetchSimilarMedia = async (type, id) => {
  if (type === 'anime') return []; // Optional: add Anilist recommendations
  const res = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
};

export const fetchSeasons = async (tvId) => {
  const res = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.seasons || [];
};

export const fetchEpisodes = async (tvId, seasonNumber) => {
  const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.episodes || [];
};

export const getWatchUrl = (type, id, season = 1, episode = 1) => {
  if (type === 'tv' || type === 'anime') {
    return `https://player.videasy.net/tv/${id}/${season}/${episode}`;
  }
  return `https://player.videasy.net/movie/${id}`;
};