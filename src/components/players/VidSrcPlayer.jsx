// src/components/players/VidSrcPlayer.jsx
import { getVidSrcEmbed } from "../../utils/vidsrc";

const VidSrcPlayer = ({ type, imdb, tmdb, season, episode, subUrl, dsLang, autoplay, autonext }) => {
  const src = getVidSrcEmbed({ type, imdb, tmdb, season, episode, subUrl, dsLang, autoplay, autonext });

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={src}
        title="VidSrc Player"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
};

export default VidSrcPlayer;
