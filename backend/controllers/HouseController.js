const House = require('../models/House');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');

module.exports = class HouseController {

  static async registerHouse(req, res) {
    const { title, value, rooms, category, adress, description } = req.body;
    const images = req.files;
    const available = true;

    if(!title) {
      res.status(422).json({ message: 'O título é obrigatório!' });
      return;
    }
    if(!value) {
      res.status(422).json({ message: 'O valor é obrigatório!' });
      return;
    }
    if(!rooms) {
      res.status(422).json({ message: 'O número de cômodos é obrigatório!' });
      return;
    }
    if(!category) {
      res.status(422).json({ message: 'A categoria é obrigatória!' });
      return;
    }
    if(!adress) {
      res.status(422).json({ message: 'O endereço é obrigatório!' });
      return;
    }
    if(images.length === 0) {
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
    } catch(error){
      res.status(500).json({ message: error });
    }
  }

}