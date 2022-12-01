const server = require('./server');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const PORT = process.env.PORT || 3001;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(connection => {
    console.log('connected to DB');
});

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
