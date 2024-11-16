import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/productos/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');

        const data = await response.json();
        console.log("Datos del producto:", data); // Para depuración
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        titulo: product.titulo,
        precio: parseFloat(product.precio),
        cantidad: 1
      });
      alert('Producto agregado al carrito');
    }
  };

  if (loading) return <div className="container mt-4">Cargando...</div>;
  if (error) return <div className="container mt-4">Error: {error}</div>;
  if (!product) return <div className="container mt-4">Producto no encontrado</div>;

  // Accede a la URL de la imagen desde el array 'imagenes'
  const imagenUrl = (product.imagenes && product.imagenes.length > 0) ? product.imagenes[0].url : '/ruta/a/imagen/predeterminada.jpg';

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={imagenUrl} 
            alt={product.titulo} 
            className="img-fluid"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.titulo}</h2>
          <p className="text-muted">{product.categoria}</p>
          <p>{product.descripcion}</p>
          <h3 className="text-primary">${product.precio}</h3>
          <div className="mt-3">
            <button 
              className="btn btn-primary"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;