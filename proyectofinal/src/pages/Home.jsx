import React, { useState, useEffect } from 'react';
import ProductGallery from './ProductGallery';
import { fetchData } from '../services/api';
import ProductCard  from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
        if (!response.ok) throw new Error('Error al cargar los productos');

        const data = await response.json();
        setFeaturedProducts(data.slice(0, 6)); // Limitar a los primeros 6 productos
      } catch (err) {
        setError('Error al cargar los productos. Por favor, intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container">
      <header className="text-center py-5">
        <h1 className="display-4">Sarang Shop 💕🎵</h1>
        <p className="lead text-muted">Descubre nuestra colección de productos</p>
      </header>
      
      <section className="featured-products mb-5">
        <h2 className="text-center mb-4">Productos Destacados</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {featuredProducts.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;