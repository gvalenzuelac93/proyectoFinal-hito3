const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token; // Leer el token desde las cookies
  if (!token) {
    return res.status(401).send({ error: 'Acceso denegado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Usa tu clave secreta desde el entorno
    req.user = verified; // Adjuntar datos decodificados al objeto de la solicitud
    next();
  } catch (err) {
    res.status(403).send({ error: 'Token inválido o expirado' });
  }
};