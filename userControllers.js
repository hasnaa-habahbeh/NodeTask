import jwt from 'jsonwebtoken';
import { secret } from './index.js';
import { User } from './UserModel.js';

const getUserData = async (username) => {
    return await User.findOne({ username });
}

export const addUser = async (req, res) => {
    const { username, password, country } = req.body;

    const userFromDB = await getUserData(username);
    if (userFromDB) {
        return res.status(401).json({
            status: 'fail',
            message: 'already exists in DB!'
        });
    }

    const user = {
        username,
        password,
        country
    };

    const newUser = new User(user);
    await newUser.save();

    const token = jwt.sign(user, secret); // in case any db errors happened

    return res.status(200).json({
        status: 'success',
        token
    });
};

export const getUser = async (req, res, next) => {
    const user = req.body;
    const userFromDB = await getUserData(user.username);

    if (!userFromDB) {
        res.redirect(302, '/signup');
        return next();
    }

    const isCorrectPassword = user.password === userFromDB.password;
    if (!isCorrectPassword) {
        return res.status(403).json({
            status: 'fail',
            message: 'Forbidden - incorrect password'
        });
    }
0
    const token = jwt.sign(user, secret);

    return res.status(200).json({
        status: 'success',
        token
    });
}
