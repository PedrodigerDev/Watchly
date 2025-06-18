// src/components/WatchPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMediaDetails, getWatchUrl } from '../api';
import Player from './Player';
import './WatchPage.css';

const WatchPage = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(Number(season) || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(Number(episode) || 1);
  const [episodeList, setEpisodeList] = useState([]);

  useEffect(() => {
    fetchMediaDetails(type, id).then((data) => {
      setMedia(data);

      if (type === 'tv' && data?.seasons?.length > 0) {
        const currentSeason = data.seasons.find(s => s.season_number === selectedSeason);
        if (currentSeason && currentSeason.episodes) {
          setEpisodeList(currentSeason.episodes);
        } else {
          const fallbackEpisodes = Array.from({ length: currentSeason?.episode_count || 1 }, (_, i) => ({
            episode_number: i + 1,
            name: ''
          }));
          setEpisodeList(fallbackEpisodes);
        }
      }
    });
  }, [type, id, selectedSeason]);

  const handleSeasonClick = (seasonNum) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisode(1);
    navigate(`/watch/${type}/${id}/${seasonNum}/1`);
  };

  const handleEpisodeClick = (epNum) => {
    setSelectedEpisode(epNum);
    navigate(`/watch/${type}/${id}/${selectedSeason}/${epNum}`);
  };

  const title = media?.title?.romaji || media?.title || media?.name || 'Loading...';
  const videoSrc = getWatchUrl(type, id, selectedSeason, selectedEpisode);

  return (
    <div className="watch-page">
      <h2 className="watch-title">{title}</h2>

      <Player src={videoSrc} />

      {(type === 'tv' || type === 'anime') && (
        <div className="selectors-wrapper">
          {media?.seasons?.length > 0 && (
            <div className="selector-group horizontal">
              <h3>Season</h3>
              <div className="selector-container horizontal-scroll">
                {media.seasons.map((s) => (
                  <button
                    key={s.season_number}
                    className={`selector-btn ${selectedSeason === s.season_number ? 'active' : ''}`}
                    onClick={() => handleSeasonClick(s.season_number)}
                  >
                    {s.name || `Season ${s.season_number}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {episodeList.length > 0 && (
            <div className="selector-group horizontal">
              <h3>Episode</h3>
              <div className="selector-container horizontal-scroll">
                {episodeList.map((ep) => (
                  <button
                    key={ep.episode_number}
                    className={`selector-btn ${selectedEpisode === ep.episode_number ? 'active' : ''}`}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                    title={ep.name || `Episode ${ep.episode_number}`}
                  >
                    Ep {ep.episode_number}
                    {ep.name && <span className="ep-name"> — {ep.name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchPage;