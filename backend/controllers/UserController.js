const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/createUserToken');

module.exports = class UserController {

  static async register(req, res) {
    
    const {name, email, phone, password, confirmpassword } = req.body;

    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório' });
      return;
    }
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório' });
      return;
    }
    if(!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório' });
      return;
    }
    if(!password) {
      res.status(422).json({ message: 'A senha é obrigatória' });
      return;
    }
    if(!confirmpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
      return;
    }

    if(password !== confirmpassword) {
      res.status(422).json({ message: 'As senhas precisam ser iguais' });
      return;
    }

    const userExists = await User.findOne({email: email});

    if(userExists) {
      res.status(422).json({ message: 'E-mail já cadastrado!' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res)
    } catch(error) {
      res.status(500).json({ message: error });
    }

  }

}