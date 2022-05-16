const mongoose = require('../db/conn');
const { Schema } = mongoose;

const House = mongoose.model(
  'House',
  new Schema({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    rooms: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    adress: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
      required: true
    },
    available: {
      type: Boolean
    },
    user: Object,
    renter: Object,
    schedule: Object,
  },
  { timestamps: true }
  )
);

module.exports = House;