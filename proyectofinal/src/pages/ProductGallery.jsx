import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductGallery.css';

const ProductGallery = ({ limit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:3000/api/productos');
                if (!response.ok) throw new Error('Error al cargar los productos');

                const data = await response.json();
                console.log('Datos recibidos:', data); // Para depuración
                setProducts(data);
            } catch (err) {
                setError('Error al cargar los productos. Por favor, intente nuevamente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [limit]);

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

    if (!Array.isArray(products)) {
        return <div>Error: Los productos no se cargaron correctamente.</div>;
    }

    return (
        <div className='container'>
            <div className="product-gallery">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {products.map(( product) => (
                        <div className="col" key={product.id}>
                            <div className="card">
                                <img src={product.image} className="card-img-top" alt={product.titulo} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.titulo}</h5>
                                    <p className="card-text">${product.precio}</p>
                                    <button className="btn btn-primary" onClick={() => navigate(`/product/${product.id}`)}>Ver Detalles</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;