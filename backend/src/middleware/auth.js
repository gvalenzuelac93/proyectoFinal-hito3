const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send({ error: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, 'SECRET');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ error: 'Token inválido' });
  }
};