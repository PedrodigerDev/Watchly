import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const WatchPage = () => {
  const { id, type } = useParams();
  const color = '8B5CF6'; // purple

  let iframeUrl = '';
  if (type === 'movie') {
    iframeUrl = `https://player.videasy.net/movie/${id}?color=${color}`;
  } else if (type === 'tv') {
    iframeUrl = `https://player.videasy.net/tv/${id}/1/1?color=${color}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true`;
  } else if (type === 'anime') {
    iframeUrl = `https://player.videasy.net/anime/${id}/1?color=${color}`;
  }

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data && data.id) {
          const current = JSON.parse(localStorage.getItem('watchHistory') || '{}');
          current[data.id] = {
            ...data,
            type,
            updatedAt: Date.now(),
          };
          localStorage.setItem('watchHistory', JSON.stringify(current));

          // 🔁 Broadcast to any listening React component (like MediaGrid)
          window.postMessage(JSON.stringify({ updateWatchHistory: true }), '*');
        }
      } catch (err) {
        console.error('Watch progress error:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, type]);

  return (
    <div className="watch-page">
      <Link to="/">← Back to Browse</Link>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={iframeUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media"
          title={`Watch ${type} ${id}`}
        ></iframe>
      </div>
    </div>
  );
};

export default WatchPage;