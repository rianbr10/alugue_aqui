const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.DB);
  console.log("Connected!");
}

main().catch((err) => console.log(err));

module.exports = mongoose;