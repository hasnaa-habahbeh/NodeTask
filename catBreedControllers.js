import { CatBreeds } from './CatBreedsModel.js';

export const seedCatBreeds = async (req, res) => {
    const apiUrl = process.env.API_URL;

    try {
        const apiRes = await fetch(apiUrl);
        const jsonRes = await apiRes.json();
        const apiData = jsonRes.data;

        apiData.forEach(apiCatBreed => {
            let catBreed = new CatBreed({
                breed: apiCatBreed.breed,
                country: apiCatBreed.country,
                origin: apiCatBreed.origin,
                coat: apiCatBreed.coat,
                pattern: apiCatBreed.pattern
            });
            catBreed.save();
        });
    } catch (error) {
        console.error(error);
    }

    res.status(200).json({
        status: 'success',
        message: 'Seeded DB successfully'
    });
}

export const notFound = async (req, res) => {
    return res.status(404).json({
        status: 'fail',
        message: 'Page not found!',
    });
}

export const matchByBreed = async (req, res, next) => {
    const breed = new RegExp(req.query.breed);

    const result = await CatBreeds.find({ breed: { $regex: breed } });

    if (!result.length) {
        res.redirect(307, '/not-found');
        return next();
    }

    res.status(200).json({
        status: 'success',
        message: result,
    });
}

export const getCatBreeds = async (req, res) => {
    const limit = 10;
    const result = await CatBreeds.find({}).limit(limit);

    res.status(200).json({
        status: 'success',
        message: result,
    });
}

export const getCatBreed = async (req, res, next) => {
    const breedParam = req.params.breed;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const result = await CatBreeds.find({ breed: modifiedBreedParam } );

    if (!result.length) {
        res.redirect(307, '/not-found');
        return next();
    }

    res.status(200).json({
        status: 'success',
        message: result[0],
    });
}

export const addCatBreed = async (req, res) => {
    const { breed = '', country = '', origin = '', coat = '', pattern = '' } = req.body;

    if(!breed) {
        return res.status(400).json({
            status: 'fail',
            message: 'can\t process you request!'
        });
    }

    const newCatBreed = new CatBreeds({
        breed,
        country,
        origin,
        coat,
        pattern,
    });
    const result = await newCatBreed.save();

    res.status(201).json({
        status: 'success',
        message: result,
    });
}

export const editCatBreed = async (req, res, next) => {
    const breedParam = req.params.breed;
    const updatedData = req.body;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const dbCatBreed = await CatBreeds.findOneAndUpdate(
        { breed: modifiedBreedParam },
        updatedData
    );

    if (!dbCatBreed?.breed) {
        res.redirect(307, '/not-found');
        return next();
    }

    const result = await CatBreeds.findOne({ breed: modifiedBreedParam });

    res.status(200).json({
        status: 'success',
        message: result
    });
}

export const removeCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    await CatBreeds.findOneAndRemove({ breed: modifiedBreedParam });

    return res.status(204).json({
        status: 'success',
        message: null,
    });
}
