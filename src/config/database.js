const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kathiravan:spuorgpkj@namastenode.owjpmkh.mongodb.net/devTinder');
}

module.exports = connectDB;