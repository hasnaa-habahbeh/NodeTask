const express = require('express');
const { 
    seedCatBreeds,
    matchByBreed,
    getCatBreeds,
    getCatBreed,
    addCatBreed,
    editCatBreed,
    removeCatBreed
} = require('../controllers/catBreedControllers');

const router = express.Router();

router
    .route('/fetch')
    .get(seedCatBreeds);

router
    .route('/match')
    .get(matchByBreed);

router
    .route('/:breed')
    .get(getCatBreed)
    .patch(editCatBreed)
    .delete(removeCatBreed);

router
    .route('/')
    .get(getCatBreeds)
    .post(addCatBreed);

module.exports = router;
