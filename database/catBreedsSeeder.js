const CatBreed = require('./CatBreedsModel');

const apiUrl = 'https://catfact.ninja/breeds';

const seedCatBreeds = async () => {
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
};

module.exports = seedCatBreeds;
