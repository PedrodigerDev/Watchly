// Replace the base URL if your VidEasy embed differs.
const VidEasyPlayer = ({ imdbId, season, episode }) => {
  const path = season && episode
    ? `https://player.videasy.org/embed/tv/${imdbId}/${season}-${episode}`
    : `https://player.videasy.org/embed/movie/${imdbId}`;

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={path}
        title="VidEasy Player"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
};

export default VidEasyPlayer;
