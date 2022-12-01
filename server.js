const express = require('express');
const bodyParser = require('body-parser');
const catBreedRouter = require('./routes/catBreedRoutes');

const server = express();

// Middleware
server.use(express.json());
server.use(bodyParser.json()); 

// Router
server.use('/catBreed', catBreedRouter);

module.exports = server;
