import React, { useEffect, useState } from 'react';
import { fetchAiringTodayTV } from '../api';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [airing, setAiring] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAiringTodayTV();
      setAiring(data);
    };
    load();
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <Link to="/">← Back to Browse</Link>
      <h1 style={{ marginTop: '16px' }}>📆 TV Shows Airing Today</h1>

      {airing.length === 0 ? (
        <p style={{ color: '#aaa' }}>No shows airing today.</p>
      ) : (
        <div className="horizontal-scroll" style={{ flexWrap: 'wrap', gap: '16px' }}>
          {airing.map((show) => (
            <div key={show.id} style={{ minWidth: '180px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#fff' }}>
                {show.name}
              </div>
              {show.next_episode_to_air && (
                <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                  S{show.next_episode_to_air.season_number}E{show.next_episode_to_air.episode_number} — {show.next_episode_to_air.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
