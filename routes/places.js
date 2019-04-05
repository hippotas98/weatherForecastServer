var express = require('express');
var router = express.Router();
const mongoose = require('../common/mongoose')

const Place = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    address: {
        type: String,
        require: true,
    },
    
})
