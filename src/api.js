const TMDB_API_KEY = 'd0629388a91b8c64fa792bb0988fa654';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const ANILIST_BASE = 'https://graphql.anilist.co';
const VIDEASY_BASE = 'https://player.videasy.net';

export async function fetchAll(type = 'movie', page = 1) {
  const res = await fetch(`${TMDB_BASE}/${type}/popular?api_key=${TMDB_API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchTrending(type = 'movie') {
  const res = await fetch(`${TMDB_BASE}/trending/${type}/week?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchAllByGenre(type, genreId, page = 1) {
  if (type === 'anime') return fetchAnimeByGenre(genreId, page);
  const res = await fetch(
    `${TMDB_BASE}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await res.json();
  return data.results || [];
}

export async function searchTMDB(type, query) {
  const res = await fetch(`${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results || [];
}

export async function searchAnilist(query) {
  const res = await fetch(ANILIST_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($search: String) {
          Page(perPage: 10) {
            media(search: $search, type: ANIME) {
              id
              title { romaji }
              coverImage { large }
              description
              genres
              averageScore
              episodes
              seasonYear
              format
            }
          }
        }
      `,
      variables: { search: query },
    }),
  });
  const { data } = await res.json();
  return data?.Page?.media || [];
}

export async function fetchAnimeByGenre(genre, page = 1) {
  const res = await fetch(ANILIST_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($genre: String, $page: Int) {
          Page(page: $page, perPage: 10) {
            media(genre_in: [$genre], type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji }
              coverImage { large }
              description
              averageScore
              genres
            }
          }
        }
      `,
      variables: { genre, page },
    }),
  });
  const { data } = await res.json();
  return data?.Page?.media || [];
}

export async function fetchMediaDetails(type, id) {
  if (type === 'anime') {
    const res = await fetch(ANILIST_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title { romaji }
              description
              coverImage { large }
              averageScore
              genres
              episodes
              format
              seasonYear
              isAdult
              rating
            }
          }
        `,
        variables: { id: parseInt(id) },
      }),
    });
    const { data } = await res.json();
    return data?.Media;
  }

  // TMDB
  const base = `${TMDB_BASE}/${type}/${id}`;
  const info = await fetch(`${base}?api_key=${TMDB_API_KEY}`).then(r => r.json());

  let rating = null;

if (type === 'movie') {
  const res = await fetch(`${base}/release_dates?api_key=${TMDB_API_KEY}`).then(r => r.json());
  const usEntry = res.results?.find(r => r.iso_3166_1 === 'US');
  const cert = usEntry?.release_dates?.find(d => d.certification)?.certification;
  rating = cert || 'NR';
} else if (type === 'tv') {
  const res = await fetch(`${base}/content_ratings?api_key=${TMDB_API_KEY}`).then(r => r.json());
  const usRating = res.results?.find(r => r.iso_3166_1 === 'US')?.rating;
  rating = usRating || 'NR';
}

  return { ...info, rating };
}


export async function fetchSimilarMedia(type, id) {
  if (type === 'anime') {
    const media = await fetchMediaDetails(type, id);
    const genre = media?.genres?.[0];
    if (!genre) return [];
    return fetchAnimeByGenre(genre);
  } else {
    const res = await fetch(`${TMDB_BASE}/${type}/${id}/similar?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results || [];
  }
}

export function getWatchUrl(type, id, options = {}) {
  let url = '';

  if (type === 'movie') {
    url = `${VIDEASY_BASE}/movie/${id}`;
  } else if (type === 'tv') {
    const { season = 1, episode = 1 } = options;
    url = `${VIDEASY_BASE}/tv/${id}/${season}/${episode}`;
  } else if (type === 'anime') {
    const { episode = 1, dub = false } = options;
    url = `${VIDEASY_BASE}/anime/${id}/${episode}?dub=${dub}`;
  }

  const { color = '8B5CF6', progress, nextEpisode, episodeSelector, autoplayNextEpisode } = options;
  const params = [];

  if (color) params.push(`color=${color}`);
  if (progress) params.push(`progress=${progress}`);
  if (nextEpisode) params.push('nextEpisode=true');
  if (episodeSelector) params.push('episodeSelector=true');
  if (autoplayNextEpisode) params.push('autoplayNextEpisode=true');

  if (params.length) {
    url += (url.includes('?') ? '&' : '?') + params.join('&');
  }

  return url;
}