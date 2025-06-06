import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWatchUrl, fetchMediaDetails, fetchSimilarMedia } from '../api';
import Player from './Player';
import Card from './Card';
import './WatchPage.css';

const WatchPage = () => {
  const { type, id } = useParams();
  const [media, setMedia] = useState(null);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const load = async () => {
      const details = await fetchMediaDetails(type, id);
      const recommended = await fetchSimilarMedia(type, id);
      setMedia(details);
      setSimilar(recommended);
    };
    load();
  }, [type, id]);

  if (!media) return <div className="watch-page">Loading...</div>;

  const title = media.title?.romaji || media.title || media.name;
  const poster = media.coverImage?.large || `https://image.tmdb.org/t/p/w300${media.poster_path}`;

  return (
    <div className="watch-page">
      <h2>{title}</h2>

      <Player src={getWatchUrl(type, id)} />

      <div className="media-info">
        <img src={poster} alt={title} />
        <p>{media.overview || media.description}</p>
      </div>

      {similar.length > 0 && (
        <div className="section">
          <h3>You May Also Like</h3>
          <div className="scroll-container">
            {similar.map((item) => (
              <Card key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;