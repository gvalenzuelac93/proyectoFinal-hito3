import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductGallery.css';
import ProductCard from '../components/ProductCard';

const ProductGallery = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
                if (!response.ok) throw new Error('Error al cargar los productos');

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar los productos. Por favor, intente nuevamente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Función para truncar la descripción
    const truncateDescription = (description, maxLength) => {
        if (!description) return ''; // Maneja el caso donde la descripción puede ser null o undefined
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...'; // Agrega '...' si se recorta
        }
        return description;
    };

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
                            <ProductCard 
                                product={{
                                    ...product,
                                    descripcion: truncateDescription(product.descripcion, 150) // Limitar a 100 caracteres
                                }} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;