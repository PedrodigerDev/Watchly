import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSimilarTitles } from '../api';
import Card from './Card';

const WatchPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [resumeTime, setResumeTime] = useState(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [similarTitles, setSimilarTitles] = useState([]);

  const color = '8B5CF6';

  // Load resume time from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    const entry = history[id];
    if (entry && entry.timestamp > 60) {
      setResumeTime(entry.timestamp);
      setShowResumePrompt(true);
    }
  }, [id]);

  // Fetch similar titles (TMDB only)
  useEffect(() => {
    if (type !== 'anime') {
      fetchSimilarTitles(id, type).then(setSimilarTitles);
    }
  }, [id, type]);

  // Track watch progress from iframe messages
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
          window.postMessage(JSON.stringify({ updateWatchHistory: true }), '*');
        }
      } catch (err) {
        console.error('Watch progress error:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, type]);

  // Iframe URL with optional resume progress
  const progressParam = resumeTime ? `&progress=${Math.floor(resumeTime)}` : '';
  let iframeUrl = '';
  if (type === 'movie') {
    iframeUrl = `https://player.videasy.net/movie/${id}?color=${color}${progressParam}`;
  } else if (type === 'tv') {
    iframeUrl = `https://player.videasy.net/tv/${id}/1/1?color=${color}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true${progressParam}`;
  } else if (type === 'anime') {
    iframeUrl = `https://player.videasy.net/anime/${id}/1?color=${color}${progressParam}`;
  }

  const handleResume = () => setShowResumePrompt(false);
  const handleStartOver = () => {
    setResumeTime(0);
    setShowResumePrompt(false);
  };

  const handleSurprise = () => {
    const list = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    const values = Object.values(list);
    if (values.length > 0) {
      const random = values[Math.floor(Math.random() * values.length)];
      navigate(`/watch/${random.type}/${random.id}`);
    }
  };

  return (
    <div className="watch-page" style={{ padding: '16px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/">← Back to Browse</Link>
        <button onClick={handleSurprise} style={{ fontSize: '0.85rem' }}>
          🎲 Surprise Me
        </button>
      </div>

      {showResumePrompt && (
        <div className="resume-prompt">
          <p>Resume from {new Date(resumeTime * 1000).toISOString().substr(11, 8)}?</p>
          <button onClick={handleResume}>Yes</button>
          <button onClick={handleStartOver}>No</button>
        </div>
      )}

      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '24px' }}>
        <iframe
          src={iframeUrl}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-presentation"
          title={`Watch ${type} ${id}`}
        ></iframe>
      </div>

      {similarTitles.length > 0 && (
        <div className="genre-section">
          <h2>🎞️ Similar Titles</h2>
          <div className="horizontal-scroll">
            {similarTitles.map((item) => (
              <Card key={item.id + '_sim'} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;