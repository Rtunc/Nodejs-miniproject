const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
  username: {type:String, default:""},
  email:  {type:String, default:""},
  password: {type:String, default:""},
  refreshToken: {type:String},
  isAdmin:{type: Boolean, default: false},
  isSeller:{type: Boolean, default: false}

});

module.exports = mongoose.model('user', User);
