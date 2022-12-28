import jwt from 'jsonwebtoken';
import { secret } from './index.js';
import { User } from './UserModel.js';

const getUserData = async (username) => {
    return await User.findOne({ username });
}

export const addUser = async (req, res) => {
    const { username, password, country } = req.body;

    const userFromDB = await getUserData(username);
    if (userFromDB.length) {
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
    const token = jwt.sign(user, secret);

    const newUser = new User({
       ...user,
    });
    const result = await newUser.save();

    return res.status(200).json({
        status: 'success',
        message: {
            ...result._doc,
        },
        token
    });
};

export const getUser = async (req, res, next) => {
    const user = req.body;
    const userFromDB = await getUserData(user.username);

    if (!userFromDB.length) {
        res.redirect(302, '/signup');
        return next();
    }

    const isCorrectPassword = user.password === userFromDB[0].password;
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
        message: {
            ...user,
        },
        token
    });
}

export const logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'no token'
        });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'invalid',
                message: 'token has expired, access denied'
            })
        }

        jwt.sign(req.user, secret, {
            expiresIn: '1'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Logged out',
            token
        });
    });
}
