const CatBreeds = require('../database/CatBreedsModel');
const seedCatBreeds = require('../database/catBreedsSeeder');

exports.seedCatBreeds = async (req, res) => {
    await seedCatBreeds();
    res.status(200).json({
        status: 'success',
        message: 'Seeded DB successfully'
    });
}

exports.matchByBreed = async (req, res) => {
    const breed = new RegExp(req.query.breed);

    const result = await CatBreeds.find({ breed: { $regex: breed } });

    if (!result.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'cant find breed in DB!',
        });
    }

    res.status(200).json({
        status: 'success',
        message: result,
    });
}

exports.getCatBreeds = async (req, res) => {
    const limit = 10;
    const result = await CatBreeds.find({}).limit(limit);

    res.status(200).json({
        status: 'success',
        message: result,
    });
}

exports.getCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const result = await CatBreeds.find({ breed: modifiedBreedParam } );

    if (!result.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'cant find cat breed in DB!',
        });
    }

    res.status(200).json({
        status: 'success',
        message: result[0],
    });
}

exports.addCatBreed = async (req, res) => {
    const { breed = '', country = '', origin = '', coat = '', pattern = '' } = req.body;

    const newCatBreed = new CatBreeds({
        breed,
        country,
        origin,
        coat,
        pattern,
    });
    newCatBreed.save();

    const result = await CatBreeds.find({ breed: newCatBreed.breed });

    res.status(201).json({
        status: 'success',
        message: result[0],
    });
}

exports.editCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const updatedData = req.body;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const dbCatBreed = await CatBreeds.findOneAndUpdate(
        { breed: modifiedBreedParam },
        updatedData
    );
    
    if (!dbCatBreed?.breed) {
        res.status(404).json({
            status: 'fail',
            message: 'cant edit a cat breed that doesn\'t exist!',
        });
    }

    const result = await CatBreeds.findOne({ breed: modifiedBreedParam });

    res.status(200).json({
        status: 'success',
        message: result
    });
}

exports.removeCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    await CatBreeds.findOneAndRemove({ breed: modifiedBreedParam });

    return res.status(204).json({
        status: 'success',
        message: null,
    });
}
