import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sortResults } from '../services/searchService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]); // Inicializado como un arreglo vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const query = searchParams.get('q')?.toLowerCase();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
        if (!query) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/api/productos/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Error al buscar productos');

            const searchResults = await response.json();
            setResults(searchResults);
        } catch (err) {
            setError(`Error al buscar productos: ${err.message}`);
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchResults();
}, [query]);

  const handleSort = (value) => {
    setSortBy(value);
    const newResults = sortResults(results, value);
    setResults(newResults);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Resultados para "{query}"</h2>
        <select 
          className="form-select w-auto" 
          value={sortBy} 
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="relevance">Relevancia</option>
          <option value="price-low">Precio: Menor a Mayor</option>
          <option value="price-high">Precio: Mayor a Menor</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      {Array.isArray(results) && results.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron resultados para "{query}"
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">
            Se encontraron {Array.isArray(results) ? results.length : 0} resultados
          </p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {Array.isArray(results) ? results.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100">
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.titulo}
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.titulo}</h5>
                    <p className="card-text">
                      {product.descripcion.length > 100 
                        ? `${product.descripcion.substring(0, 100)}...` 
                        : product.descripcion}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">Categoría: {product.categoria}</small>
                    </p>
                    <p className="card-text">
                      <strong>Precio: ${product.precio}</strong>
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            )) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;