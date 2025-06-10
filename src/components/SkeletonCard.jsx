import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-thumbnail" />
    <div className="skeleton-text short" />
    <div className="skeleton-text long" />
  </div>
);

export default SkeletonCard;
