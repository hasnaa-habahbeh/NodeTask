import mongoose from 'mongoose';

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

const CatBreeds = mongoose.model('CatBreed', CatBreedSchema);

export {
    CatBreeds
};
