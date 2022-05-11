const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUserToken = require('../helpers/createUserToken');
const validateEmail = require('../helpers/validateEmail');
const getToken = require('../helpers/getToken');

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

    await validateEmail.validateEmailRegister(email, req, res);

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

  static async login(req, res) {
    
    const {email, password} = req.body;

    if(!email) {
      res.status(422).json({ message: 'Digite um e-mail!' });
      return;
    }
    if(!password) {
      res.status(422).json({ message: 'Digite uma senha!' });
    }

    const user = await User.findOne({email: email});

    await validateEmail.validateEmailLogin(email, req, res);

    const checkPassowrd = await bcrypt.compare(password, user.password);
    if(!checkPassowrd) {
      res.status(422).json({ message: 'Senha incorreta!' });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;
 
    if(req.headers.authorization) {

      const token = getToken(req);
      const decoded = jwt.verify(token, 'abcdefghijk');

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;

    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }
}