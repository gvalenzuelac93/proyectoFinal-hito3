import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!auth) {
    return null;
  }

  const { user, logout } = auth;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); // Redirige a la búsqueda
      setSearchTerm(''); // Limpia el campo de búsqueda
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-secondary bg-secondary flex-column">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <form className="d-flex me-auto" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 ">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">Tienda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/acerca-de">Acerca de</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            {user && user.role === 'admin' && ( // Mostrar solo si es admin
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Panel Admin</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown me-2">
                <button className="btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                  {user.name || 'Usuario'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin">Panel Admin</Link></li> // Asegura que el admin tenga el acceso aquí también
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>Cerrar sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light me-2">Iniciar sesión</Link>
            )}
            <Link to="/cart" className="btn btn-outline-light position-relative">
              <i className="bi bi-cart"></i>
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
