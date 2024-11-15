import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Asegúrate de que 'imagen' sea la propiedad correcta que contiene la URL de la imagen
    const imagenUrl = product.imagen || 'ruta/a/imagen/predeterminada.jpg'; // Imagen predeterminada

    return (
        <div className="card">
            <img src={imagenUrl} className="card-img-top" alt={product.titulo} />
            <div className="card-body">
                <h5 className="card-title">{product.titulo}</h5>
                <p className="card-text">{product.descripcion}</p>
                <p className="card-text">${product.precio}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary">Ver detalles</Link>
            </div>
        </div>
    );
};

export default ProductCard;