const jwt = require('jsonwebtoken');

const verificarToken = async (req, res, next) => {
    // Obtener el token del encabezado Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Verificar si el token fue proporcionado
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        
        // Almacenar la información del usuario decodificada en req.user
        req.user = {
            id: decoded.id, 
            email: decoded.email,
            rol: decoded.rol
        };

        // Continuar con la siguiente función de middleware
        next();
    } catch (error) {
        // Manejo de errores si el token es inválido
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = verificarToken;