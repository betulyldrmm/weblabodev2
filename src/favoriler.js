import React from 'react';
import { Link } from 'react-router-dom';

const Favoriler = ({ favorites }) => {
  return (
    <div className="favorites-page">
      <h2>Favori Haberler</h2>
      {favorites.length === 0 ? (
        <p>Henüz favorinizde haber yok.</p>
      ) : (
        favorites.map((item, index) => (
          <div key={index} className="card">
            <img 
              src={item.urlToImage || 'https://via.placeholder.com/400x200'}
              alt={item.title}
            />
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.description}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Haberi Oku</a>
            </div>
          </div>
        ))
      )}
      <Link to="/" className="back-btn">Geri dön</Link>
    </div>
  );
};

export default Favoriler;
