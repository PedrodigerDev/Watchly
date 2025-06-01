import React from 'react';
import './i18n'; // i18n must load before anything renders
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import GenrePage from './pages/GenrePage';
import WatchHistory from './pages/WatchHistory';
import Calendar from './pages/Calendar';

import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { useTranslation } from 'react-i18next';

serviceWorkerRegistration.register();

function App() {
  const { i18n, t } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <Router>
      <div className="App">
        <header style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #333',
          backgroundColor: '#111'
        }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
            🎬 Watchly
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/history">{t('watch_history')}</Link>
            <Link to="/calendar">{t('calendar')}</Link>
            <button onClick={toggleLang} style={{
              background: 'transparent',
              border: '1px solid #555',
              color: 'white',
              borderRadius: '4px',
              padding: '4px 10px',
              cursor: 'pointer'
            }}>
              {i18n.language === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<MediaGrid />} />
          <Route path="/watch/:type/:id" element={<WatchPage />} />
          <Route path="/genre/:genreName" element={<GenrePage />} />
          <Route path="/history" element={<WatchHistory />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;