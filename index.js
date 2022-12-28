import express from 'express';
import jwt from 'jsonwebtoken';
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
import {
    getUser,
    addUser,
} from './userControllers.js';

const server = express();

dotenv.config({ path: './config.env' });
server.use(express.json());

const PORT = process.env.PORT || 3001;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
export const secret = process.env.SECRET;
export const apiUrl = process.env.API_URL;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, secret);
        next();
    } else {
        return res.json({
            status: 'Forbidden',
            message: 'not verified'
        })
    }
}

// Routes:
server.get('/not-found', verifyToken, notFound);
server.get('/fetch', verifyToken, seedCatBreeds);
server.get('/match', verifyToken, matchByBreed);
server.get('/:breed', verifyToken, getCatBreed);
server.put('/:breed', verifyToken, editCatBreed);
server.delete('/:breed', verifyToken, removeCatBreed);
server.get('/', verifyToken, getCatBreeds);
server.post('/', verifyToken, addCatBreed);

server.post('/signup', addUser);
server.post('/login', getUser);

mongoose.connect(DB).then(connection => {
    console.log('connected to DB');
});

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
