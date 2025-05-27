// src/components/Player.js
import React, { useEffect } from 'react';

const Player = ({ src }) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          if (message && message.id && message.type) {
            const key = `progress_${message.type}_${message.id}`;
            localStorage.setItem(key, JSON.stringify(message));
            console.log("Progress saved to localStorage:", message);
          }
        } catch (e) {
          console.warn("Invalid message from iframe:", event.data);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!src) return null;

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginTop: 20 }}>
      <iframe
        src={src}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameBorder="0"
        allowFullScreen
        allow="encrypted-media"
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default Player;