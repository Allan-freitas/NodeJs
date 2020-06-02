var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuario = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  knownAs: {
    type: String,
  },
  lastActive: {
    type: Date,
  },
  introduction: {
    type: String,
  },
  lookingFor: {
    type: String,
  },
  interests: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  created: {
    type: Date,
  },
  age: {
    type: Number
  }
});

module.exports = mongoose.model("Usuario", usuario);
