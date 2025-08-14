// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <h1 className="logo">Watchly</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/?type=movie">Movies</a>
          <a href="/?type=tv">TV Shows</a>
          <a href="/my-list">My List</a>
        </nav>
      </div>
    </header>
  );
}
