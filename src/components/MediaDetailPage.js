import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMediaDetails } from '../api';
import './MediaDetailPage.css';

const MediaDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    fetchMediaDetails(type, id).then(setMedia);
  }, [type, id]);

  if (!media) return <div className="media-detail">Loading...</div>;

  const title = media.title?.romaji || media.title || media.name;
  const img = media.coverImage?.large || `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  const description = media.description || media.overview || 'No description available.';
  const rating = media.rating || media.contentRating || (media.isAdult ? '18+' : 'NR');

  const handleWatchClick = () => {
    const defaultSeason = type === 'tv' ? 1 : undefined;
    const defaultEpisode = type === 'tv' || type === 'anime' ? 1 : undefined;
    navigate(`/watch/${type}/${id}${defaultSeason ? `/${defaultSeason}/${defaultEpisode}` : ''}`);
  };

  return (
    <div className="media-detail">
      <h2>{title}</h2>
      <div className="media-detail-content">
        <img src={img} alt={title} />
        <div className="media-meta">
          <p className="media-description" dangerouslySetInnerHTML={{ __html: description }} />
          <p className="media-rating"><strong>Age Rating:</strong> {rating}</p>
          <button className="watch-now-btn" onClick={handleWatchClick}>▶ Watch Now</button>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailPage;