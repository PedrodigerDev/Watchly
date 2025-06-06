import React, { useEffect, useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import './Player.css';

const Player = ({ src }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          if (message?.id && message?.type) {
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!src) return null;

  return (
    <div className="player-container">
      <div className="player-wrapper">
        <iframe
          src={src}
          className="player-iframe"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title="Video Player"
        ></iframe>
      </div>

      <button className="player-share-btn" onClick={handleShare} title="Copy share link">
        <FaShareAlt />
      </button>

      {copied && <span className="share-toast">Copied!</span>}
    </div>
  );
};

export default Player;
