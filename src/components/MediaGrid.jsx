import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import {
  fetchTrending,
  fetchAllByGenre,
  searchTMDB,
  searchAnilist,
} from '../api';
import AdBanner from './AdBanner';
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
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi',
  ],
};

const MediaGrid = ({ type = 'movie' }) => {
  const [trending, setTrending] = useState([]);
  const [genreResults, setGenreResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const scrollRefs = useRef({});

  useEffect(() => {
    setTrending([]);
    setGenreResults({});
    fetchTrending(type).then(setTrending);

    const genres = genresMap[type] || [];
    genres.forEach((genre) => {
      const idOrName = typeof genre === 'string' ? genre : genre.id;
      fetchAllByGenre(type, idOrName).then((data) => {
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
        left: dir === 'left' ? -window.innerWidth * 0.8 : window.innerWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="media-grid-wrapper">
      {/* Search Bar */}
      <input
        className="search-bar"
        placeholder={`Search ${type}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Static Ad above content for AdSense compliance */}
      <div className="static-ad-section">
        <AdBanner slot="5830833564" />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="section">
          <h2>Search Results</h2>
          <div className="scroll-btn left" onClick={() => scroll('search', 'left')}>&lt;</div>
          <div className="scroll-btn right" onClick={() => scroll('search', 'right')}>&gt;</div>
          <div className="scroll-container" ref={(el) => (scrollRefs.current['search'] = el)}>
            {searchResults.map((item) => (
              <Card key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div className="section">
        <h2>Trending</h2>
        <div className="scroll-btn left" onClick={() => scroll('trending', 'left')}>&lt;</div>
        <div className="scroll-btn right" onClick={() => scroll('trending', 'right')}>&gt;</div>
        <div className="scroll-container" ref={(el) => (scrollRefs.current['trending'] = el)}>
          {trending.map((item) => (
            <Card key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>

      {/* Genres */}
      {(genresMap[type] || []).map((genre, index) => {
        const idOrName = typeof genre === 'string' ? genre : genre.id;
        const label = typeof genre === 'string' ? genre : genre.name;
        const results = genreResults[idOrName] || [];

        return (
          <React.Fragment key={idOrName}>
            <div className="section">
              <h2>{label}</h2>
              <div className="scroll-btn left" onClick={() => scroll(idOrName, 'left')}>&lt;</div>
              <div className="scroll-btn right" onClick={() => scroll(idOrName, 'right')}>&gt;</div>
              <div className="scroll-container" ref={(el) => (scrollRefs.current[idOrName] = el)}>
                {results.map((item) => (
                  <Card key={item.id} item={item} type={type} />
                ))}
              </div>
            </div>

            {/* Keep between-rows ads, but styled */}
            {(index + 1) % 2 === 0 && (
              <div className="inline-ad-section">
                <AdBanner slot="5830833564" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MediaGrid;
