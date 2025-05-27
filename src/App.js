import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Watchly</h1>
        <Routes>
          <Route path="/" element={<MediaGrid />} />
          <Route path="/watch/:type/:id" element={<WatchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
