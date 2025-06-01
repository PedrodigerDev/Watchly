import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchAllByGenre,
  fetchAnimeByGenre
} from '../api';
import Card from '../components/Card';

const GenrePage = () => {
  const { genreName } = useParams();
  const [items, setItems] = useState([]);
  const [type, setType] = useState('movie');
  const [genreId, setGenreId] = useState(null);

  const genreMap = {
    movie: {
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Fantasy: 14
    },
    tv: {
      'Action & Adventure': 10759,
      Comedy: 35,
      Drama: 18,
      Animation: 16
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'anime') {
        const anime = await fetchAnimeByGenre(genreName);
        setItems(anime);
      } else {
        const map = genreMap[type];
        const foundId = Object.entries(map).find(([_, name]) => name === genreName)?.[0];
        setGenreId(foundId);
        if (foundId) {
          const result = await fetchAllByGenre(foundId, type);
          setItems(result);
        }
      }
    };

    fetchData();
  }, [genreName, type]);

  return (
    <div style={{ padding: '16px' }}>
      <Link to="/">← Back to Browse</Link>
      <h1 style={{ marginTop: '16px' }}>{genreName}</h1>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            className={`tab-button ${type === t ? 'active' : ''}`}
            onClick={() => setType(t)}
          >
            {t === 'movie' ? 'Movies' : t === 'tv' ? 'TV Shows' : 'Anime'}
          </button>
        ))}
      </div>

      <div className="horizontal-scroll" style={{ flexWrap: 'wrap', gap: '12px' }}>
        {items.map((item) => (
          <Card key={item.id + '_genre'} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;