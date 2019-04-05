const mongoose = require('mongoose')

let CommentSchema = mongoose.Schema({
    author: {
        type: String
    },
    content: {
        type: String
    }
})

let PlaceSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        longitude: {
            require: true,
            type: Number,
        },
        latitude: {
            require: true,
            type: Number,
        },
        city: {
            require: true,
            type: String,
        },
        detail: {
            require: true,
            type: String
        }
    },
    preference: {
        minTemp: {
            type: Number
        },
        maxTemp: {
            type: Number
        },
        season: {
            type: String
        }
    },
    comments: {
        type: [CommentSchema]
    },
    rating: {
        type: Number,
        min: [0,'Must be a positive integer'],
        max: [5,'Must less than or equal to 5']
    }
})

module.exports = PlaceSchema;