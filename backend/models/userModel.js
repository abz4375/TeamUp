const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        'first-name': {
            type: String,
            required: [true, 'Please add first-name']
        },
        'last-name': {
            type: String,
            required: [true, 'Please add last-name']
        }
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Please add password']
    },
    'email-id': {
        type :String ,
        required: [true,'Please add email id'],
        unique: true
    },
    projects: {
        type: Array,
        // required: [true, 'Please add projects']
    },
    tasks: {
        type: Array,
        // required: [true, 'Please add tasks']
    },
    contributions: {
        type: Array,
        // required: [true, 'Please add contributions']
    }

},{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)