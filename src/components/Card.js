import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const TMDB_API_KEY = 'd0629388a91b8c64fa792bb0988fa654';

const Card = ({ item, type }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const title = item.title?.romaji || item.title || item.name;
  const img = item.poster_path
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : item.coverImage?.large;

  const isInWatchlist = () => {
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    return list.some((i) => i.id === item.id);
  };

  const toggleWatchlist = (e) => {
    e.stopPropagation();
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const updated = isInWatchlist()
      ? list.filter((i) => i.id !== item.id)
      : [...list, { ...item, type }];
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  useEffect(() => {
    if (hovered && !trailerUrl && type !== 'anime') {
      const id = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${TMDB_API_KEY}`
          );
          const data = await res.json();
          const trailer = data.results?.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            setTrailerUrl(
              `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0`
            );
          }
        } catch (err) {
          console.error('Failed to fetch trailer:', err);
        }
      }, 1000);
      setTimeoutId(id);
    }

    return () => clearTimeout(timeoutId);
  }, [hovered]);

  const handleClick = () => {
    navigate(`/title/${type}/${item.id}`);
  };

  return (
    <div
      className="media-card"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTrailerUrl(null);
        clearTimeout(timeoutId);
      }}
    >
      <div className="card-thumbnail">
        {!hovered || !trailerUrl ? (
          <img src={img} alt={title} loading="lazy" />
        ) : (
          <iframe
            src={trailerUrl}
            title="Trailer"
            allow="autoplay; muted"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>

      <div className="card-info">
        <p className="card-title">{title}</p>
        <button className="watchlist-btn" onClick={toggleWatchlist}>
          {isInWatchlist() ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
};

export default Card;
