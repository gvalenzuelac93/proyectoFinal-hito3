const request = require('supertest');
const app = require('./src/app'); // Asegúrate de que la ruta sea correcta
const pool = require('./src/config/db');

describe('API REST Tests', () => {
  
    it('should register a user', async () => {
        const email = `test_${Date.now()}@example.com`; // Generar un correo único
        const response = await request(app)
          .post('/api/usuarios/registro')
          .send({
            email: email, // Usar el correo generado
            contraseña: 'password123',
            nombre: 'Test User'
          });
      
        expect(response.statusCode).toBe(201); // Verifica que el código de estado sea 201
        expect(response.body).toHaveProperty('id'); // Verifica que se devuelva el ID del usuario
        expect(response.body).toHaveProperty('email', email); // Verifica que el correo electrónico sea correcto
        expect(response.body).toHaveProperty('nombre', 'Test User'); // Verifica que el nombre sea correcto
      });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'test@example.com',
        contraseña: 'password123',
      });
    
    expect(response.statusCode).toBe(200); // Cambia según el código de estado esperado
    expect(response.body).toHaveProperty('token'); // Verifica que se reciba un token
  });

  afterAll(async () => {
    await pool.end(); // Cerrar conexiones a la base de datos
  });
});
