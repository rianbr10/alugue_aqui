const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

const checkToken = (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(403).json({ message: 'Acesso negado!' });
  }

  const token = getToken(req);
  if(!token) {
    res.status(403).json({ message: 'Acesso negado!' });
  }

  try {
    const verifed = jwt.verify(token, 'abcdefghijk');
    req.user = verifed;
    next();
  } catch(error){
    res.status(400).json({ message: 'Token inválido!' });
  }
}

module.exports = checkToken;