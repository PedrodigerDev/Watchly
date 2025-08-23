// src/components/VideoPlayer.js
import { useState } from "react";
import Player from "./Player";
import { getVidSrcUrl, getVidEasyUrl } from "../utils/providers";

const VideoPlayer = ({ imdbId, tmdbId, season, episode }) => {
  const [provider, setProvider] = useState("vidsrc");

  let src = "";
  if (provider === "vidsrc") {
    src = getVidSrcUrl({ type: season && episode ? "tv" : "movie", imdb: imdbId, tmdb: tmdbId, season, episode });
  } else if (provider === "videasy") {
    src = getVidEasyUrl({ imdbId });
  }

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setProvider("vidsrc")} disabled={provider === "vidsrc"}>
          VidSrc
        </button>
        <button onClick={() => setProvider("videasy")} disabled={provider === "videasy"}>
          VidEasy
        </button>
      </div>

      <Player src={src} />
    </div>
  );
};

export default VideoPlayer;
