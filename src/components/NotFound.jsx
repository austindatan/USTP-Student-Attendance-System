import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        textAlign: 'center',
        backgroundColor: '#f0f2f5',
        color: '#333'
    }}>
      <h1 style={{ fontSize: '4em', margin: '0.2em 0' }}>404</h1>
      <h2 style={{ fontSize: '1.5em', marginBottom: '1em' }}>Page Not Found</h2>
      <p style={{ fontSize: '1em', marginBottom: '2em' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        style={{
            padding: '10px 20px',
            backgroundColor: '#1D4ED8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1em'
        }}
      >
        Uli sainyo home yut
      </Link>
    </div>
  );
};

export default NotFound;