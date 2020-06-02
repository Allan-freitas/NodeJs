var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var moment = require("moment");
var age = require("../../common/Age.js");

var VerifyToken = require(__root + "common/VerifyToken");

router.use(bodyParser.urlencoded({ extended: true }));
var User = require("../../model/usuario.js");

// CREATES A NEW USER
router.post("/", function (req, res) {
  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    function (err, user) {
      if (err)
        return res
          .status(500)
          .send("There was a problem adding the information to the database.");
      res.status(200).send(user);
    }
  );
});

// Retorna todos os usuários da base de dados
router.get("/", function (req, res) {
  User.find({}, function (err, users) {
    if (err)
      return res.status(500).send("Hove um problema ao trazer os usuários.");
    var usuarios = [];
    users.forEach((us) => {
      var formatted_date = moment(us.created).format("DD-MM-YYYY");
      var lastActive_date = moment(us.lastActive).format("DD-MM-YYYY");
      usuarios.push({
        _id: us._id,
        interests: us.interests,
        lookingFor: us.lookingFor,
        introduction: us.introduction,
        country: us.country,
        photoUrl: us.photoUrl,
        city: us.city,
        created: formatted_date,
        username: us.username,
        name: us.name,
        lastActive: lastActive_date,
        age: age.getAge(us.dateOfBirth),
        knownAs: us.knownAs,
        name: us.name
      });
    });
    res.status(200).send(JSON.stringify(usuarios));
  });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get("/:id", function (req, res) {
  User.findById(req.params.id, function (err, usuario) {
    if (err)
      return res
        .status(500)
        .send("Houve um problema ao tentar encontrar o usuário.");
    if (!usuario) return res.status(404).send("No user found.");

    var formatted_date = moment(usuario.created).format("DD-MM-YYYY");
    var lastActive_date = moment(usuario.lastActive).format("DD-MM-YYYY");

    res.status(200).send({
      interests: usuario.interests,
      lookingFor: usuario.lookingFor,
      introduction: usuario.introduction,
      country: usuario.country,
      photoUrl: usuario.photoUrl,
      city: usuario.city,
      created: formatted_date,
      username: usuario.username,
      name: usuario.name,
      lastActive: lastActive_date,
      age: age.getAge(usuario.dateOfBirth),
      knownAs: usuario.knownAs,
      name: usuario.name,
    });
  });
});

// DELETES A USER FROM THE DATABASE
router.delete("/:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User: " + user.name + " was deleted.");
  });
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put(
  "/:id",
  /* VerifyToken, */ function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (
      err,
      user
    ) {
      if (err)
        return res.status(500).send("There was a problem updating the user.");
      res.status(200).send(user);
    });
  }
);

module.exports = router;
