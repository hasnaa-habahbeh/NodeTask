import { CatBreeds } from './CatBreedsModel.js';
import { apiUrl } from './index.js';

export const seedCatBreeds = async (req, res) => {
    try {
        const apiRes = await fetch(`${apiUrl}?limit=98`);
        const jsonRes = await apiRes.json();

        const apiData = jsonRes.data;

        const dbApiData = apiData.map(apiCatBreed => new CatBreeds({
            breed: apiCatBreed.breed,
            country: apiCatBreed.country,
            origin: apiCatBreed.origin,
            coat: apiCatBreed.coat,
            pattern: apiCatBreed.pattern
        }));

        await CatBreeds.insertMany(dbApiData);

        return res.status(200).json({
            status: 'success',
            message: 'Seeded DB successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
}

export const notFound = async (req, res) => {
    return res.status(404).json({
        status: 'fail',
        message: 'Page not found!',
    });
}

export const matchByBreed = async (req, res) => {
    const breed = new RegExp(req.query.breed);

    const result = await CatBreeds.find({ breed: { $regex: breed } });

    res.status(200).json({
        status: 'success',
        message: result,
    });
}

export const getCatBreeds = async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skippingIndex = 25 * (page - 1);

    const apiRes = await fetch(apiUrl);
    const apiLastPage = await apiRes.json().last_page;

    if (page > apiLastPage) {
        return res.status(404).json({
            status: 'fail',
            message: `Page doesn\'t exist, max pages number is ${apiLastPage} `,
        });
    }

    const result = await CatBreeds.find({}).limit(limit).skip(skippingIndex);

    return res.status(200).json({
        status: 'success',
        message: result,
    });
}

export const getCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const result = await CatBreeds.find({ breed: modifiedBreedParam } );

    if (!result.length) {
        return res.redirect(307, '/not-found');
    }

    res.status(200).json({
        status: 'success',
        message: result[0],
    });
}

export const addCatBreed = async (req, res) => {
    const { breed, country = '', origin = '', coat = '', pattern = '' } = req.body;

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

export const editCatBreed = async (req, res) => {
    const breedParam = req.params.breed;
    const updatedData = req.body;
    const modifiedBreedParam = breedParam.replace('_', ' ');

    const dbCatBreed = await CatBreeds.findOneAndUpdate(
        { breed: modifiedBreedParam },
        updatedData
    );

    if (!dbCatBreed) {
        return res.redirect(307, '/not-found');
    }

    res.status(200).json({
        status: 'success',
        message: dbCatBreed
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
