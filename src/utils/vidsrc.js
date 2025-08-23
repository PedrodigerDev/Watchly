// src/utils/vidsrc.js
const BASE_DOMAIN = "https://vidsrc.xyz"; // you can rotate if needed

export function getVidSrcEmbed({ type, imdb, tmdb, season, episode, subUrl, dsLang, autoplay, autonext }) {
  let url = `${BASE_DOMAIN}/embed`;

  if (type === "movie") {
    url += "/movie";
  } else if (type === "tv") {
    url += "/tv";
  }

  const params = new URLSearchParams();

  if (imdb) params.append("imdb", imdb);
  if (tmdb) params.append("tmdb", tmdb);

  if (type === "tv" && season && episode) {
    // Use path-style for season/episode
    return `${url}/${imdb || tmdb}/${season}-${episode}${
      dsLang || subUrl || autoplay || autonext ? "?" + params.toString() : ""
    }`;
  }

  if (dsLang) params.append("ds_lang", dsLang);
  if (subUrl) params.append("sub_url", encodeURIComponent(subUrl));
  if (autoplay !== undefined) params.append("autoplay", autoplay ? "1" : "0");
  if (autonext !== undefined) params.append("autonext", autonext ? "1" : "0");

  return params.toString() ? `${url}?${params.toString()}` : url;
}
