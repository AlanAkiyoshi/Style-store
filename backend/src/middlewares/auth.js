const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ erro: 'Token nao fornecido.' });

  const token = authHeader.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}

function apenasAdmin(req, res, next) {
  if (req.usuario.perfil !== 'admin')
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  next();
}

module.exports = { autenticar, apenasAdmin };
