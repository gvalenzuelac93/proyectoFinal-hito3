const request = require('supertest');
const app = require('../src/app'); 
const pool = require('../src/config/db');

describe('API REST Tests', () => {
    afterAll(async () => {
        await pool.end(); // Cerrar conexiones a la base de datos
    });

    it('should register a user', async () => {
        const response = await request(app)
            .post('/api/usuarios/registrar')
            .send({
                nombre: 'Test User',
                email: `test_${Date.now()}@example.com`,
                contraseña: 'password123'
            });

        expect(response.statusCode).toBe(201); // Verifica que el código de estado sea 201
        expect(response.body).toHaveProperty('id'); // Verifica que se devuelva el ID del usuario
    });

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/usuarios/login')
            .send({
                email: 'cami@ejemplo.com', 
                contraseña: '123456',
            });

        expect(response.statusCode).toBe(200); // Verifica que el código de estado sea 200
        expect(response.body).toHaveProperty('user'); // Verifica que se devuelva la información del usuario
    });

    it('should search for a product', async () => {
      const response = await request(app)
          .get('/api/productos/search?q=anime'); 

      expect(response.statusCode).toBe(200); // Verifica que el código de estado sea 200
      expect(Array.isArray(response.body)).toBe(true); // Verifica que se devuelva un array
      expect(response.body.length).toBeGreaterThan(0); // Verifica que se devuelvan resultados
  });

  it('should get all products', async () => {
      const response = await request(app)
          .get('/api/productos');

      expect(response.statusCode).toBe(200); // Verifica que el código de estado sea 200
      expect(Array.isArray(response.body)).toBe(true); // Verifica que se devuelva un array
  });
});