import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    const values = Object.values(saved).sort((a, b) => b.updatedAt - a.updatedAt);
    setHistory(values);
  }, []);

  const handleRemove = (id) => {
    const current = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    delete current[id];
    localStorage.setItem('watchHistory', JSON.stringify(current));
    setHistory(Object.values(current).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const filtered = filter === 'all'
    ? history
    : history.filter((item) => item.type === filter);

  return (
    <div style={{ padding: '16px' }}>
      <Link to="/">← Back to Browse</Link>
      <h1 style={{ marginTop: '16px' }}>📜 Watch History</h1>

      <div className="tabs" style={{ marginBottom: '20px' }}>
        {['all', 'movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            className={`tab-button ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#aaa' }}>No watch history yet.</p>
      ) : (
        <div className="horizontal-scroll" style={{ flexWrap: 'wrap', gap: '12px' }}>
          {filtered.map((item) => (
            <div key={item.id + '_hist'} style={{ position: 'relative' }}>
              <Card item={item} type={item.type} />
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <button
                  onClick={() => navigate(`/watch/${item.type}/${item.id}`)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    marginRight: '4px',
                    backgroundColor: '#8B5CF6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Resume
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    backgroundColor: '#444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;