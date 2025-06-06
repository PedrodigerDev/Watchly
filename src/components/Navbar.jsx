import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [params] = useSearchParams();
  const type = params.get('type') || 'movie';
  const navigate = useNavigate();

  const handleTabClick = (newType) => {
    navigate(`/?type=${newType}`);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">🎬 Watchly</h1>
      <div className="nav-tabs">
        {['movie', 'tv', 'anime'].map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${type === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
