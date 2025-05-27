// src/components/Search.js
import React, { useState } from 'react';
import { searchTMDB, searchAnilist } from '../api';
import Player from './Player';

const Search = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie');
  const [results, setResults] = useState([]);
  const [playerUrl, setPlayerUrl] = useState('');
  const [episode, setEpisode] = useState(1);
  const [season, setSeason] = useState(1);
  const [dubbed, setDubbed] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    if (type === 'anime') {
      const anime = await searchAnilist(query);
      setResults([anime]);
    } else {
      const data = await searchTMDB(query, type);
      setResults(data);
    }
  };

  const playContent = (item) => {
    let url = '';
    const baseColor = '8B5CF6';

    if (type === 'movie') {
      url = `https://player.videasy.net/movie/${item.id}?color=${baseColor}`;
    } else if (type === 'tv') {
      url = `https://player.videasy.net/tv/${item.id}/${season}/${episode}?color=${baseColor}&episodeSelector=true&nextEpisode=true&autoplayNextEpisode=true`;
    } else if (type === 'anime') {
      url = `https://player.videasy.net/anime/${item.id}/${episode}?color=${baseColor}&dub=${dubbed}`;
    }

    setPlayerUrl(url);
  };

  return (
    <div>
      <h2>Search for Movies, TV Shows, or Anime</h2>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="movie">Movie</option>
        <option value="tv">TV Show</option>
        <option value="anime">Anime</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      {type !== 'movie' && (
        <div style={{ marginTop: '10px' }}>
          {type === 'tv' && (
            <>
              <label>Season: </label>
              <input
                type="number"
                min="1"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
              />
            </>
          )}
          <label> Episode: </label>
          <input
            type="number"
            min="1"
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
          />
        </div>
      )}

      {type === 'anime' && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={dubbed}
              onChange={(e) => setDubbed(e.target.checked)}
            />
            Watch Dubbed
          </label>
        </div>
      )}

      <ul>
        {results.map((item, index) => (
          <li key={item.id || index} style={{ marginTop: 10 }}>
            {item.title?.romaji || item.title || item.name}
            <button onClick={() => playContent(item)} style={{ marginLeft: 10 }}>Watch</button>
          </li>
        ))}
      </ul>

      <Player src={playerUrl} />
    </div>
  );
};

export default Search;