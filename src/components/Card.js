import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const TMDB_API_KEY = 'd0629388a91b8c64fa792bb0988fa654';

const Card = ({ item, type }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const timerRef = useRef(null);

  const title =
    item?.title?.romaji || item?.title || item?.name || item?.original_title || item?.original_name;

  const img = useMemo(() => {
    if (item?.poster_path) return `https://image.tmdb.org/t/p/w300${item.poster_path}`;
    if (item?.coverImage?.large) return item.coverImage.large;
    if (item?.backdrop_path) return `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
    return '';
  }, [item]);

  const ratioClass = useMemo(() => {
    return item?.backdrop_path && !item?.poster_path ? 'landscape' : 'portrait';
  }, [item]);

  const isInWatchlist = () => {
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    return list.some((i) => i.id === item.id);
  };

  const toggleWatchlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const updated = isInWatchlist()
      ? list.filter((i) => i.id !== item.id)
      : [...list, { ...item, type }];
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  useEffect(() => {
    if (hovered && !trailerUrl && type !== 'anime') {
      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/${type}/${item.id}/videos?api_key=${TMDB_API_KEY}`
          );
          const data = await res.json();
          const trailer = data?.results?.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            setTrailerUrl(
              `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0`
            );
          }
        } catch (err) {
          console.error('Failed to fetch trailer:', err);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [hovered, trailerUrl, type, item?.id]);

  const handleClick = () => {
    navigate(`/details/${type}/${item.id}`);
  };

  return (
    <div
      className={`media-card card ${ratioClass} ${hovered ? 'is-hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTrailerUrl(null);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
      }}
    >
      <div className="card-thumbnail">
        {!hovered || !trailerUrl ? (
          img ? (
            <img src={img} alt={title} loading="lazy" />
          ) : (
            <div className="img-fallback">{title?.[0] || '?'}</div>
          )
        ) : (
          <iframe
            src={trailerUrl}
            title={`${title} Trailer`}
            allow="autoplay; encrypted-media; picture-in-picture"
            frameBorder="0"
            allowFullScreen
          />
        )}

        {/* Hover-only overlay */}
        <div className="card-overlay">
          <div className="overlay-top">
            <button className="watchlist-btn overlay-btn" onClick={toggleWatchlist}>
              {isInWatchlist() ? '★' : '☆'}
            </button>
          </div>
          <div className="overlay-bottom">
            <p className="overlay-title">{title}</p>
          </div>
        </div>
      </div>

      {/* Below-thumb info (title only, for mobile/touch users) */}
      <div className="card-info">
        <p className="card-title">{title}</p>
      </div>
    </div>
  );
};

export default Card;
