import React from 'react';
import ProductGallery from './ProductGallery';

const Home = () => {
  return (
    <div className="container">
      <header className="text-center py-5">
        <h1 className="display-4">Sarang Shop 💕🎵</h1>
        <p className="lead text-muted">Descubre nuestra colección de productos</p>
      </header>
      
      <section className="featured-products mb-5">
        <h2 className="text-center mb-4">Productos Destacados</h2>
        <ProductGallery limit={6} />
      </section>
    </div>
  );
};

export default Home;