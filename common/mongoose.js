const mongoose = require('mongoose')
const UserSchema = require('../entities/users.model')
const PlaceSchema = require('../entities/places.model')
const UserInforSchema = require('../entities/userInfor.model')
mongoose.connect('mongodb://localhost:27017/weatherApp', function (err) {
  
    if (err) throw err;
  
    console.log('Successfully connected');
  
 });
mongoose.model('User',UserSchema)
mongoose.model('Place', PlaceSchema)
mongoose.model('UserInfor', UserInforSchema)
module.exports = mongoose