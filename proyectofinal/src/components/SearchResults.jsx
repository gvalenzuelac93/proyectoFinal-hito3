import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { sortResults } from '../services/searchService';
import { fetchData } from "../services/api";
import ProductCard from '../components/ProductCard'; // Importar ProductCard

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Error al buscar productos');

            const searchResults = await response.json();
            console.log(searchResults);
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
                <div className="col" key={product.id}>
                    <ProductCard product={product} />
                </div>
            )) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;