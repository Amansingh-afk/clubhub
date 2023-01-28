const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please, Enter your name'],
        maxlength: [30, 'Name cannot exceed 30 characters'],
        minlength: [4, 'Name must be 4 character long'],
    },
    username: {
        type: String,
        required: [true, 'Please, Enter your username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please, Enter your email'],
        unique: true,
        validator: [validator.isEmail, 'Please provide valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter your password'],
        select: false,          //hide password in .find() method.
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'club_admin', 'super_admin'],
        default: 'student',
    },
    course: {
        type: String,
        required:[true, 'Please, Enter your course']
    },
    semester: {
        type: Number,
        required: [true, 'Please, Enter your semester'],
    },
    roll_no: {
        type: String,
        required: [true, 'Please, Enter your Roll no.'],
    },
    phone_no: { type: Number },
    avatar: {
        public_id:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
});

module.exports = mongoose.model('User', userSchema);