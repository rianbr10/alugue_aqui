const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUserToken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');

module.exports = class UserController {

  static async register(req, res) {

    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório' });
      return;
    }
    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório' });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório' });
      return;
    }
    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória' });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: 'As senhas precisam ser iguais' });
      return;
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
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
    } catch (error) {
      res.status(500).json({ message: error });
    }

  }

  static async login(req, res) {

    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: 'Digite um e-mail!' });
      return;
    }
    if (!password) {
      res.status(422).json({ message: 'Digite uma senha!' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(422).json({ message: 'E-mail não cadastrado!' });
      return;
    }

    const checkPassowrd = await bcrypt.compare(password, user.password);
    if (!checkPassowrd) {
      res.status(422).json({ message: 'Senha incorreta!' });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {

      const token = getToken(req);
      const decoded = jwt.verify(token, 'abcdefghijk');

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;

    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }
    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }
    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    //validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório' });
      return;
    }
    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório' });
      return;
    }
    const userExists = await User.findOne({ email: email });
    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Email já cadastrado' });
      return;
    }
    user.email = email;

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório' });
      return;
    }
    user.phone = phone;

    if (password != confirmpassword) {
      res.status(422).json({ message: 'As senhas precisam ser iguais' });
      return;
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    try {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }

  }
}