import React, { useEffect, useRef, useState } from 'react';
import {
  fetchTrending,
  fetchMediaByGenre,
  fetchAnimeGenres,
  fetchAnimeByGenre,
  searchTMDB,
  searchAnilist,
} from '../api';
import { useDebounce } from '../hooks/useDebounce';
import Card from './Card';

const MediaGrid = () => {
  const [type, setType] = useState('movie');
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [trending, setTrending] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem('watchlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [watchHistory, setWatchHistory] = useState(() => {
    const stored = localStorage.getItem('watchHistory');
    return stored ? Object.values(JSON.parse(stored)) : [];
  });

  const scrollRefs = useRef([]);
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const fetchAll = async () => {
      if (debouncedSearch.trim()) {
        const result = type === 'anime'
          ? await searchAnilist(debouncedSearch)
          : await searchTMDB(debouncedSearch, type);
        setSearchResults(Array.isArray(result) ? result : [result]);
        return;
      }

      setSearchResults([]);

      if (type !== 'anime') {
        const trendingData = await fetchTrending(type);
        setTrending(trendingData);
      } else {
        setTrending([]);
      }

      if (type === 'anime') {
        const genres = await fetchAnimeGenres();
        const results = await Promise.all(
          genres.map(async (genre) => ({
            genre,
            items: await fetchAnimeByGenre(genre),
          }))
        );
        setSections(results);
      } else {
        const results = await Promise.all(
          (genreMap[type] || []).map(async (genreId) => ({
            genre: genreLabels[genreId] || `Genre ${genreId}`,
            items: await fetchMediaByGenre(type, genreId, sortBy),
          }))
        );
        setSections(results);
      }
    };

    fetchAll();
  }, [debouncedSearch, type, sortBy]);

  const handleWatchlistChange = (updatedList) => {
    setWatchlist(updatedList);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
  };

  const handleHistoryUpdate = (updatedItem) => {
    setWatchHistory((prev) => {
      const existing = [...prev.filter(i => i.id !== updatedItem.id), updatedItem];
      localStorage.setItem('watchHistory', JSON.stringify(
        Object.fromEntries(existing.map(i => [i.id, i]))
      ));
      return existing;
    });
  };

  const scrollRow = (index, direction) => {
    const ref = scrollRefs.current[index];
    if (ref) {
      ref.scrollBy({ left: direction === 'left' ? -500 : 500, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Search & Sort */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#1f1f1f',
            color: '#fff',
            width: '280px',
          }}
        />
        {type !== 'anime' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: '#1f1f1f',
              color: '#fff',
              border: '1px solid #444',
            }}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="release_date.desc">Newest First</option>
            <option value="vote_average.desc">Top Rated</option>
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            className={`tab-button ${type === t ? 'active' : ''}`}
            onClick={() => {
              setType(t);
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            {t === 'movie' ? 'Movies' : t === 'tv' ? 'TV Shows' : 'Anime'}
          </button>
        ))}
      </div>

      {/* Watchlist */}
      {watchlist.length > 0 && !debouncedSearch && (
        <div className="genre-section">
          <h2>⭐ Your Watchlist</h2>
          <div className="scroll-wrapper">
            <div className="horizontal-scroll">
              {watchlist.map((item) => (
                <Card key={item.id + '_wl'} item={item} type={item.type || type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching */}
      {watchHistory.length > 0 && !debouncedSearch && (
        <div className="genre-section">
          <h2>🕓 Continue Watching</h2>
          <div className="scroll-wrapper">
            <div className="horizontal-scroll">
              {watchHistory.map((item) => (
                <Card key={item.id + '_cw'} item={item} type={item.type || type} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && !debouncedSearch && (
        <div className="genre-section">
          <h2>🔥 Trending</h2>
          <div className="scroll-wrapper">
            <div className="horizontal-scroll">
              {trending.map((item) => (
                <Card key={item.id + '_tr'} item={item} type={type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results or Sections */}
      {debouncedSearch && searchResults.length > 0 ? (
        <div className="genre-section">
          <h2>🔍 Search Results</h2>
          <div className="scroll-wrapper">
            <div className="horizontal-scroll">
              {searchResults.map((item) => (
                <Card key={item.id + '_search'} item={item} type={type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        sections.map((section, idx) => (
          <div className="genre-section" key={idx}>
            <h2>{section.genre}</h2>
            <div className="scroll-wrapper">
              <button className="scroll-arrow left" onClick={() => scrollRow(idx, 'left')}>◀</button>
              <div className="horizontal-scroll" ref={(el) => (scrollRefs.current[idx] = el)}>
                {section.items.map((item) => (
                  <Card key={item.id} item={item} type={type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
                ))}
              </div>
              <button className="scroll-arrow right" onClick={() => scrollRow(idx, 'right')}>▶</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MediaGrid;

const genreMap = {
  movie: [28, 35, 18, 14],
  tv: [10759, 35, 18, 16],
};

const genreLabels = {
  28: 'Action',
  35: 'Comedy',
  18: 'Drama',
  14: 'Fantasy',
  10759: 'Action & Adventure',
  16: 'Animation',
};