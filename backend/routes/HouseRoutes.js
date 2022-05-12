const router = require('express').Router();
const HouseController = require('../controllers/HouseController');

//middlewares
const verifyToken = require('../helpers/verifyToken');
const { imageUpload } = require('../helpers/imageUpload');

router.post(
  '/create', 
  verifyToken, 
  imageUpload.array('images'), 
  HouseController.registerHouse
);
router.get('/', HouseController.getAll);
router.get('/myhouses', verifyToken, HouseController.getAllUserHouses);

module.exports = router;