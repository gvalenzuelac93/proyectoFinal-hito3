import React, { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      const data = await response.json();
      alert('Gracias por tu mensaje. Te contactaremos pronto.');
      setSuccess(true);
      setFormData({ nombre: '', email: '', mensaje: '' }); // Limpiar el formulario
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Contáctanos</h1>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">Mensaje</label>
              <textarea
                className="form-control"
                id="mensaje"
                name="mensaje"
                rows="5"
                value={formData.mensaje}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn mi-botonsito" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">Mensaje enviado exitosamente.</div>}
          </form>
        </div>
        <div className="col-md-6">
          <h3>Información de Contacto</h3>
          <p><strong>Dirección:</strong> 123 Calle K-pop, Ciudad Anime, País</p>
          <p><strong>Teléfono:</strong> +569999999</p>
          <p><strong>Email:</strong> info@tiendakpopanime.com</p>
          <p><strong>Horario de Atención:</strong></p>
          <ul>
            <li>Lunes a Viernes: 9:00 AM - 6:00 PM</li>
            <li>Sábados: 10:00 AM - 4:00 PM</li>
            <li>Domingos: Cerrado</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contacto;