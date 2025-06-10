import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [params] = useSearchParams();
  const type = params.get('type') || 'movie';
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Refs and state for underline animation
  const tabRefs = useRef({});
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const handleTabClick = (newType) => {
    navigate(`/?type=${newType}`);
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (onSearch) onSearch(value);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
  };

  // Underline movement
  useEffect(() => {
    const activeTab = tabRefs.current[type];
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [type]);

  return (
    <nav className="navbar">
      <div className="logo">🎬 Watchly</div>

      <div className="nav-tabs">
        {['movie', 'tv'].map((tab) => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[tab] = el)}
            className={`nav-tab ${type === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
        <span className="nav-underline" style={underlineStyle}></span>
      </div>

      <div className="search-wrapper">
        <FaSearch className="search-icon" />
        <input
          className="navbar-search"
          placeholder={`Search ${type}...`}
          value={searchQuery}
          onChange={handleInputChange}
        />
        {searchQuery && (
          <button className="clear-btn" onClick={clearSearch}>
            ×
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;