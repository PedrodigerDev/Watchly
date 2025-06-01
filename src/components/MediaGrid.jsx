import React, { useEffect, useState, useRef } from 'react';
import {
  fetchTrending,
  fetchMediaByGenre,
  fetchAnimeGenres,
  fetchAnimeByGenre,
  searchTMDB,
  searchAnilist
} from '../api';
import Card from './Card';
import { useDebounce } from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

const genreMap = {
  movie: {
    28: 'Action',
    35: 'Comedy',
    18: 'Drama',
    14: 'Fantasy',
  },
  tv: {
    10759: 'Action & Adventure',
    35: 'Comedy',
    18: 'Drama',
    16: 'Animation',
  },
};

const MediaGrid = () => {
  const [type, setType] = useState('movie');
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [trending, setTrending] = useState([]);
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('watchlist') || '[]'));
  const [history, setHistory] = useState(() => Object.values(JSON.parse(localStorage.getItem('watchHistory') || '{}')));
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const scrollRefs = useRef([]);
  const observerRefs = useRef([]);

  const genres = type === 'anime'
    ? ['Action', 'Comedy', 'Drama', 'Romance', 'Adventure', 'Fantasy']
    : Object.entries(genreMap[type]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearch.trim()) {
        const result = type === 'anime'
          ? await searchAnilist(debouncedSearch)
          : await searchTMDB(debouncedSearch, type);
        setSearchResults(Array.isArray(result) ? result : [result]);
        return;
      }

      setSearchResults([]);

      if (type !== 'anime') {
        setTrending(await fetchTrending(type));
      }

      const results = await Promise.all(
        genres.map(async (genre) => {
          const genreName = type === 'anime' ? genre : genre[1];
          const genreId = type === 'anime' ? genre : genre[0];
          const items = type === 'anime'
            ? await fetchAnimeByGenre(genre)
            : await fetchMediaByGenre(type, genreId, sortBy);
          return { genre: genreName, items };
        })
      );

      setSections(results);
    };

    fetchData();
  }, [type, debouncedSearch, sortBy]);

  // Watch for resume updates
  useEffect(() => {
    const listener = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.updateWatchHistory) {
          setHistory(Object.values(JSON.parse(localStorage.getItem('watchHistory') || '{}')));
        }
      } catch {}
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  const scrollRow = (index, dir) => {
    scrollRefs.current[index]?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
  };

  const handleWatchlistChange = (updated) => {
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  return (
    <div className="media-grid">
      {/* Search bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              background: '#1f1f1f',
              border: '1px solid #444',
              color: 'white',
              width: '280px',
            }}
          />
          {showSuggestions && debouncedSearch && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1f1f1f',
              border: '1px solid #333',
              zIndex: 100,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {(searchResults || []).slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.title?.romaji || item.title || item.name)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #333'
                  }}
                >
                  {item.title?.romaji || item.title || item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {type !== 'anime' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', background: '#1f1f1f', color: 'white', border: '1px solid #444' }}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="release_date.desc">Newest First</option>
            <option value="vote_average.desc">Top Rated</option>
          </select>
        )}
      </div>

      {/* Tab Switch */}
      <div className="tabs">
        {['movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            className={`tab-button ${type === t ? 'active' : ''}`}
            onClick={() => {
              setType(t);
              setSearchTerm('');
              setSearchResults([]);
              setShowSuggestions(false);
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
          <div className="horizontal-scroll">
            {watchlist.map((item) => (
              <Card key={item.id + '_wl'} item={item} type={item.type || type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && !debouncedSearch && (
        <div className="genre-section">
          <h2>🕓 Continue Watching</h2>
          <div className="horizontal-scroll">
            {history.map((item) => (
              <Card key={item.id + '_cw'} item={item} type={item.type || type} />
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && !debouncedSearch && (
        <div className="genre-section">
          <h2>🔥 Trending</h2>
          <div className="horizontal-scroll">
            {trending.map((item) => (
              <Card key={item.id + '_tr'} item={item} type={type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
            ))}
          </div>
        </div>
      )}

      {/* Genre Sections */}
      {!debouncedSearch && sections.map((section, idx) => (
        <div className="genre-section" key={idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{section.genre}</h2>
            <Link to={`/genre/${encodeURIComponent(section.genre)}`}>View All →</Link>
          </div>
          <div className="scroll-wrapper">
            <button className="scroll-arrow left" onClick={() => scrollRow(idx, 'left')}>◀</button>
            <div
              className="horizontal-scroll"
              ref={(el) => (scrollRefs.current[idx] = el)}
            >
              {section.items.map((item) => (
                <Card key={item.id} item={item} type={type} watchlist={watchlist} onWatchlistChange={handleWatchlistChange} />
              ))}
            </div>
            <button className="scroll-arrow right" onClick={() => scrollRow(idx, 'right')}>▶</button>
          </div>
        </div>
      ))}

      {/* Search Results */}
      {debouncedSearch && searchResults.length > 0 && (
        <div className="genre-section">
          <h2>🔍 Search Results</h2>
          <div className="horizontal-scroll">
            {searchResults.map((item) => (
              <Card key={item.id + '_srch'} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;