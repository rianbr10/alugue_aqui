const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUserByToken = async(token) => {
  if(!token) {
    return res.status(403).json({ message: 'Acesso negado!' });
  }

  const decoded = jwt.verify(token, 'abcdefghijk');
  const userId = decoded.id;
  const user = await User.findOne({_id: userId});
  return user;
}

module.exports = getUserByToken;