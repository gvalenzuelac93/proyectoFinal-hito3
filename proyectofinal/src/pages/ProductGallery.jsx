import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductGallery.css'; // Asegúrate de que este archivo exista
import ProductCard from '../components/ProductCard';

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
                const response = await fetch('http://localhost:3000/api/productos'); // Asegúrate de que esta URL sea correcta
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
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;