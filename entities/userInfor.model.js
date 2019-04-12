const mongoose = require('mongoose')

let UserInfor = mongoose.Schema({
    idToken: {
        type: String,
        require: true,
        trim: true,
    },
    acessToken: {
        type: String,
        trim: true
    },
    user:{
        email: {
            type: String,
            require: true,
            trim: true,
        },
        id: {
            type: String,
            require: true,
            trim: true,
        },
        givenName: {
            type: String, 
        },
        familyName: {
            type: String, 
        },
        photo: {
            type: String,
        },
        name: {
            type: String, 
        },
    }
})

module.exports = UserInfor