import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import MediaDetailPage from './components/MediaDetailPage';
import Navbar from './components/Navbar';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MediaGrid />} />
        <Route path="/watch/:type/:id/:season?/:episode?" element={<WatchPage />} />
        <Route path="/title/:type/:id" element={<MediaDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
