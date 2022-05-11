const User = require('../models/User');

module.exports = {
  async validateEmailLogin(email, req, res) {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(422).json({ message: 'E-mail não cadastrado!' });
      return;
    }
  },
  async validateEmailRegister(email, req, res) {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: 'E-mail já cadastrado!' });
      return;
    }
  }
}

