import React, { useContext, useState } from 'react';
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

  if (!user || user.role !== 'admin') {
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
          ...prev ,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/productos/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      setShowForm(false);
      alert('Producto agregado exitosamente');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/productos/delete/${id}`, {
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

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>
      <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancelar' : 'Agregar Producto'}</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Título" value={newProduct.title} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Descripción" value={newProduct.description} onChange={handleInputChange} required />
          <input type="number" name="price" placeholder="Precio" value={newProduct.price} onChange={handleInputChange} required />
          <input type="file" onChange={handleImageChange} required />
          <input type="text" name="category" placeholder="Categoría" value={newProduct.category} onChange={handleInputChange} required />
          <button type="submit">Agregar</button>
        </form>
      )}
      <h3>Lista de Productos</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title} - {product.price} <button onClick={() => handleDelete(product.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;