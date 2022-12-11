import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    seedCatBreeds,
    matchByBreed,
    getCatBreeds,
    getCatBreed,
    addCatBreed,
    editCatBreed,
    removeCatBreed,
    notFound
} from './catBreedControllers.js';

const server = express();

dotenv.config({ path: './config.env' });
server.use(express.json());

// Routes:
server.get('/not-found', notFound);
server.get('/fetch', seedCatBreeds);
server.get('/match', matchByBreed);
server.get('/:breed', getCatBreed);
server.put('/:breed', editCatBreed);
server.delete('/:breed', removeCatBreed);
server.get('/', getCatBreeds);
server.post('/', addCatBreed);

const PORT = process.env.PORT || 3001;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(connection => {
    console.log('connected to DB');
});

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
