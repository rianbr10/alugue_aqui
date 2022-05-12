const House = require('../models/House');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class HouseController {

  static async registerHouse(req, res) {
    const { title, value, rooms, category, adress, description } = req.body;
    const images = req.files;
    const available = true;

    if (!title) {
      res.status(422).json({ message: 'O título é obrigatório!' });
      return;
    }
    if (!value) {
      res.status(422).json({ message: 'O valor é obrigatório!' });
      return;
    }
    if (!rooms) {
      res.status(422).json({ message: 'O número de cômodos é obrigatório!' });
      return;
    }
    if (!category) {
      res.status(422).json({ message: 'A categoria é obrigatória!' });
      return;
    }
    if (!adress) {
      res.status(422).json({ message: 'O endereço é obrigatório!' });
      return;
    }
    if (images.length === 0) {
      res.status(422).json({ message: 'A imagem é obrigatória!' });
      return;
    }

    //get house owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    //register new house
    const house = new House({
      title: title,
      value: value,
      rooms: rooms,
      category: category,
      adress: adress,
      description: description,
      available: available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    });

    images.map((image) => {
      house.images.push(image.filename);
    });

    try {
      const newHouse = await house.save();
      res.status(201).json({
        message: 'Imóvel cadastrado com sucesso!',
        newHouse
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAll(req, res) {
    const houses = await House.find().sort('-createdAt');

    try {
      res.status(200).json({ houses: houses });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getAllUserHouses(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const houses = await House.find({ 'user._id': user._id }).sort('-createdAt');

    try {
      res.status(200).json({ houses });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getAllHousesRent(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const houses = await House.find({ 'rent._id': user._id }).sort('-createdAt');

    try {
      res.status(200).json({ houses });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getHouseById(req, res) {
    const id = req.params.id;
     
    if(!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' });
      return;
    }
    
    const house = await House.findOne({_id: id});
    if(!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
    }

    try {
      res.status(200).json({ house });
      return;
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}