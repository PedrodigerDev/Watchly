// App.js
import React from 'react';
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

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          className="motion-wrapper"
          initial={{ opacity: 0, backdropFilter: 'blur(5px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(0px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <Routes location={location} key={location.pathname + location.search}>
            <Route path="/" element={<MediaGrid type={type} />} />
            <Route path="/watch/:type/:id/:season?/:episode?" element={<WatchPage />} />
            <Route path="/details/:type/:id" element={<MediaDetailPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;