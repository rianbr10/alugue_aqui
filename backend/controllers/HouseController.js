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
      schedule: [],
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

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' });
      return;
    }

    const house = await House.findOne({ _id: id });
    if (!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
    }

    try {
      res.status(200).json({ house });
      return;
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async removeHouseById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' });
      return;
    }

    const house = await House.findOne({ _id: id });
    if (!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);
    if (house.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Ocorreu um erro, tente novamente!' });
      return;
    }

    try {
      await House.findByIdAndRemove(id);
      res.status(200).json({ message: 'Imóvel removido com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateHouse(req, res) {
    const id = req.params.id;

    const { title, value, rooms, category, adress, description, available } = req.body;
    const images = req.files;

    const updatedData = {};

    const house = await House.findOne({ _id: id });
    if (!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);
    if (house.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Ocorreu um erro, tente novamente!' });
      return;
    }

    if (!title) {
      res.status(422).json({ message: 'O título é obrigatório!' });
      return;
    } else {
      updatedData.title = title;
    }

    if (!value) {
      res.status(422).json({ message: 'O valor é obrigatório!' });
      return;
    } else {
      updatedData.value = value;
    }

    if (!rooms) {
      res.status(422).json({ message: 'O número de cômodos é obrigatório!' });
      return;
    } else {
      updatedData.rooms = rooms;
    }

    if (!category) {
      res.status(422).json({ message: 'A categoria é obrigatória!' });
      return;
    } else {
      updatedData.category = category;
    }

    if (!adress) {
      res.status(422).json({ message: 'O endereço é obrigatório!' });
      return;
    } else {
      updatedData.adress = adress;
    }

    if (images.length === 0) {
      res.status(422).json({ message: 'A imagem é obrigatória!' });
      return;
    } else {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    try {
      await House.findByIdAndUpdate(id, updatedData);
      res.status(200).json({ message: 'Imóvel atualizado com sucesso!' });
      return;
    } catch (error) {
      res.status(500).json({ error });
      return;
    }
  }

  static async schedule(req, res) {
    const id = req.params.id;

    const house = await House.findOne({ _id: id });
    if (!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);
    if (house.user._id.toString() == user._id.toString()) {
      res.status(422).json({ message: 'Você não pode agendar uma visita no seu próprio imóvel!' });
      return;
    }

    if (house.schedule) {
      if (house.schedule._id == user._id) {
        res.status(422).json({ message: 'Você já agendou uma visita neste imóvel!' });
        return;
      }
    }

    house.schedule = {
      _id: user.id,
      name: user.name,
      image: user.image
    }

    try {
      await House.findByIdAndUpdate(id, house);
      res.status(200).json({
        message: `A visita foi agendada com sucesso, entre em contato com ${house.user.name} pelo telefone ${house.user.phone}!`
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async concludeRent(req, res) {
    const id = req.params.id;

    const house = await House.findOne({ _id: id });
    if (!house) {
      res.status(404).json({ message: 'Imóvel não encontrado!' });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);
    if (house.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Ocorreu um erro, tente novamente!' });
      return;
    }

    try {
      if (house.available === false) {
        res.status(422).json({ message: 'Este imóvel já esta alugado!' });
        return;
      } else {
        house.available = false;
        await House.findByIdAndUpdate(id, house);
        res.status(200).json({ message: 'Imóvel alugado com sucesso!' });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }

  }
}