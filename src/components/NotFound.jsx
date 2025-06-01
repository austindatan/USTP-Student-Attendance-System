import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const NotFound = () => {
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: '#f0f2f5',
        color: '#333',
        padding: '2em',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <img
        src="/NotFound.png"
        alt="404 Illustration"
        style={{ width: '400px', maxWidth: '90%', marginBottom: '1em' }}
      />

      <div>
        <p
          style={{
            fontSize: '1.2em',
            fontWeight: 'normal',
            marginTop: '0',
            marginBottom: '1em',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Oops! The page you're looking for doesn't exist.
        </p>
        <button 
          onClick={handleGoBack} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#1D4ED8',
            color: 'white',
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '1em',
            fontFamily: "'DM Sans', sans-serif", 
            border: 'none', 
            cursor: 'pointer', 
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;