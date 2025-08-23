const VidSrcPlayer = ({ imdbId, season, episode }) => {
  // Movie vs TV paths (adjust if your app is only movies)
  const path = season && episode
    ? `https://vidsrc.me/embed/tv/${imdbId}/${season}-${episode}`
    : `https://vidsrc.me/embed/movie/${imdbId}`;

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={path}
        title="VidSrc Player"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer"
        // sandbox is optional; relax if controls break
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
};

export default VidSrcPlayer;
