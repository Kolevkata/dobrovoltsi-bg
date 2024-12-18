// /src/components/LoadingOverlay.js
import React from 'react';
import './LoadingOverlay.css';
import { Spinner } from 'react-bootstrap';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
