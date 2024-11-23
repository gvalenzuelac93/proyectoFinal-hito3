import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
const Admin = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  if (!user || user.rol !== 'admin') {
    return <p>No tienes permiso para ver esta página.</p>;
}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          image: reader.result
        }));
        setImagePreview(reader.result); // Setear la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos del nuevo producto:', newProduct);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Error al agregar el producto');

      const product = await response.json();
      setProducts(prev => [...prev, product]);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        image: '',
        category: ''
      });
      setImagePreview('');
      setShowForm(false);
      alert('Producto agregado exitosamente');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el producto');

      setProducts(products.filter(product => product.id !== id));
      alert('Producto eliminado exitosamente');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Agregar Producto'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
        <input 
            type="text" 
            name="title" 
            placeholder="Título" 
            value={newProduct.title} 
            onChange={handleInputChange} 
            required 
            className="form-control mb-2"
        />
        <textarea 
            name="description" 
            placeholder="Descripción" 
            value={newProduct.description} 
            onChange={handleInputChange} 
            required 
            className="form-control mb-2"
        />
        <input 
            type="number" 
            name="price" 
            placeholder="Precio" 
            value={newProduct.price} 
            onChange={handleInputChange} 
            required 
            className="form-control mb-2"
        />
        <input 
            type="text" // Cambiado a tipo "text" para URL
            name="image" 
            placeholder="URL de la Imagen" // Cambiado para indicar que se espera una URL
            value={newProduct.image} 
            onChange={handleInputChange} 
            required 
            className="form-control mb-2"
        />
        <input 
            type="text" 
            name="category" 
            placeholder="Categoría" 
            value={newProduct.category} 
            onChange={handleInputChange} 
            required 
            className="form-control mb-2"
        />
        <button type="submit" className="btn btn-success">Agregar Producto</button>
    </form>
      )}
      <h3>Lista de Productos</h3>
      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{product.titulo}</h5>
              <p>{product.descripcion}</p>
              <p>Precio: ${product.precio}</p>
              <p>Categoría: {product.categoria}</p>
            </div>
            <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;