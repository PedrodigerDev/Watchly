// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import MediaDetailPage from './components/MediaDetailPage';
import './App.css';

const MainContent = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const type = params.get('type') || 'movie';

  // Initialize Google Ads when component mounts
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <>
      <Navbar />

      {/* Static ad section below navbar */}
      <section className="ad-section">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3645462764382372"
          data-ad-slot="1234567890"  // Replace with your real AdSense slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          className="motion-wrapper"
          initial={{ opacity: 0, backdropFilter: 'blur(5px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(0px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<MediaGrid type={type} />} />
            <Route path="/watch/:type/:id/:season?/:episode?" element={<WatchPage />} />
            <Route path="/details/:type/:id" element={<MediaDetailPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
