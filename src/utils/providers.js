// src/utils/providers.js
const VIDSRCDOMAIN = "https://vidsrc.xyz"; // you can swap if one goes down
const VIDEASYDOMAIN = "https://videasy.org"; // adjust if different

export function getVidSrcUrl({ type = "movie", imdb, tmdb, season, episode, dsLang, subUrl, autoplay = true, autonext = false }) {
  let url = `${VIDSRCDOMAIN}/embed/${type}`;

  const params = new URLSearchParams();
  if (imdb) params.append("imdb", imdb);
  if (tmdb) params.append("tmdb", tmdb);
  if (dsLang) params.append("ds_lang", dsLang);
  if (subUrl) params.append("sub_url", encodeURIComponent(subUrl));
  if (autoplay) params.append("autoplay", "1");
  if (autonext) params.append("autonext", "1");

  if (type === "tv" && (season && episode)) {
    return `${url}/${imdb || tmdb}/${season}-${episode}?${params.toString()}`;
  }

  return `${url}?${params.toString()}`;
}

export function getVidEasyUrl({ imdbId }) {
  return `${VIDEASYDOMAIN}/embed/${imdbId}`; 
}
