const mongoose = require('mongoose');

const CatBreedSchema = new mongoose.Schema({
    breed: {
        type: String,
        required: true
    },
    country: String,
    origin: String,
    coat: String,
    pattern: String
});

module.exports = mongoose.model('CatBreed', CatBreedSchema);
