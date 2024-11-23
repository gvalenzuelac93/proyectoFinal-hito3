import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4">
            <Link to="/" className="logo-link">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4952/4952950.png" 
                alt="Logo" 
                className="logo-img"
              />
            </Link>
          </div>
          <div className="col-md-8">
            <h1 className="site-title">Sarang Shop 💕🎵</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;