import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from './Card';
import {
  fetchAll,
  fetchTrending,
  fetchAllByGenre,
  searchTMDB,
  searchAnilist,
} from '../api';
import './MediaGrid.css';

const genresMap = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10751, name: 'Family' },
  ],
  anime: [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi'
  ],
};

const MediaGrid = () => {
  const [params] = useSearchParams();
  const type = params.get('type') || 'movie';

  const [trending, setTrending] = useState([]);
  const [genreResults, setGenreResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const scrollRefs = useRef({});
  const visibleCounts = useRef({});

  useEffect(() => {
    fetchTrending(type).then(setTrending);
    const genres = genresMap[type] || [];
    genres.forEach((genre) => {
      const idOrName = typeof genre === 'string' ? genre : genre.id;
      fetchAllByGenre(type, idOrName).then((data) => {
        visibleCounts.current[idOrName] = 10;
        setGenreResults((prev) => ({ ...prev, [idOrName]: data }));
      });
    });
  }, [type]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery) return setSearchResults([]);
    searchTimeout.current = setTimeout(async () => {
      const results =
        type === 'anime'
          ? await searchAnilist(searchQuery)
          : await searchTMDB(type, searchQuery);
      setSearchResults(results);
    }, 300);
  }, [searchQuery, type]);

  const scroll = (key, dir) => {
    const container = scrollRefs.current[key];
    if (container) {
      container.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const handleLazyLoad = (idOrName) => {
    visibleCounts.current[idOrName] += 10;
    setGenreResults((prev) => ({ ...prev }));
  };

  return (
    <div className="media-grid-wrapper">
      <div className="search-bar-container">
        <input
          className="search-bar"
          placeholder={`Search ${type}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && (
        <div className="section">
          <h2>Search Results</h2>
          <div className="scroll-container" ref={(el) => (scrollRefs.current['search'] = el)}>
            {searchResults.map((item) => (
              <Card key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <h2>Trending</h2>
        <button className="scroll-btn left" onClick={() => scroll('trending', 'left')}>&lt;</button>
        <button className="scroll-btn right" onClick={() => scroll('trending', 'right')}>&gt;</button>
        <div className="scroll-container" ref={(el) => (scrollRefs.current['trending'] = el)}>
          {trending.map((item) => (
            <Card key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>

      {(genresMap[type] || []).map((genre) => {
        const idOrName = typeof genre === 'string' ? genre : genre.id;
        const label = typeof genre === 'string' ? genre : genre.name;
        const results = genreResults[idOrName] || [];
        const visibleCount = visibleCounts.current[idOrName] || 10;

        return (
          <div key={idOrName} className="section">
            <h2>{label}</h2>
            <button className="scroll-btn left" onClick={() => scroll(idOrName, 'left')}>&lt;</button>
            <button className="scroll-btn right" onClick={() => scroll(idOrName, 'right')}>&gt;</button>
            <div className="scroll-container" ref={(el) => (scrollRefs.current[idOrName] = el)}>
              {results.slice(0, visibleCount).map((item) => (
                <Card key={item.id} item={item} type={type} />
              ))}
              {visibleCount < results.length && (
                <div className="load-more-trigger" onMouseEnter={() => handleLazyLoad(idOrName)}></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;