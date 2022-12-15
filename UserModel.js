import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    country: String
});

const User = mongoose.model('User', UserSchema);

export {
    User
};
