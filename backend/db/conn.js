const mongoose = require('mongoose');

async function main() {
  await mongoose.connect("mongodb+srv://rianbrunelli:rian789456@alugueaqui.akwtctz.mongodb.net/?retryWrites=true&w=majority");
  console.log("Connected!");
}

main().catch((err) => console.log(err));

module.exports = mongoose;