// src/components/AdBanner.js
import React, { useEffect } from 'react';

const AdBanner = ({ slot, format = "auto", responsive = "true" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-3645462764382372"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}></ins>
  );
};

export default AdBanner;
