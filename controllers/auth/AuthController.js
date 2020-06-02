var express = require("../../node_modules/express");
var router = express.Router();
var bodyParser = require("../../node_modules/body-parser");

var VerifyToken = require("../../common/VerifyToken.js");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require("../../model/usuario.js");

/**
 * Configure JWT node_modules/bcryptjs
 */
var jwt = require("../../node_modules/jsonwebtoken"); // used to create, sign, and verify tokens
var bcrypt = require("../../node_modules/bcryptjs");
var config = require("../../config/config.js"); // get config file

router.post("/login", function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("Nenhum usuário foi encontrado.");

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.passwordHash, user.passwordHash);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id, name: user.name }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({ user: user, token: token });
  });
});

router.get("/logout", function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post("/register", function (req, res) {  

  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(req.body.passwordHash, salt);  

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    passwordHash: hashedPassword,
    email: req.body.email,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    knownAs: req.body.knownAs,
    introduction: req.body.introduction,
    lookingFor: req.body.lookingFor,
    interests: req.body.interests,
    city: req.body.city,
    country: req.body.country,
    photoUrl: req.body.photoUrl
  });

  user
    .save()
    .then((data, err) => {      
      if (err)
        return res
          .status(500)
          .send({
            message:
              err.message || "Houve um problema ao tentar registrar o usuário.",
          });

      // if user is registered without errors
      // create a token
      var token = jwt.sign({ id: data._id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    })
    .catch((err) => {
      if (err)
        res.status(500).send({
          message:
            err.message ||
            "Algum erro aconteceu durante o processamento da requisição",
        });
    });

  // User.create(
  //   {
  //     name: req.body.name,
  //     username: req.body.username,
  //     password: hashedPassword,
  //     email: req.body.email,
  //     gender: req.body.gender,
  //     dateOfBirth: req.body.dateOfBirth,
  //     knownAs: req.body.knownAs,
  //     introduction: req.body.introduction,
  //     lookingFor: req.body.lookingFor,
  //     interests: req.body.interests,
  //     city: req.body.city,
  //     country: req.body.country,
  //   },
  //   function (err, user) {
  //     if (err)
  //       return res
  //         .status(500)
  //         .send("There was a problem registering the user`.");

  //     // if user is registered without errors
  //     // create a token
  //     var token = jwt.sign({ id: user._id }, config.secret, {
  //       expiresIn: 86400, // expires in 24 hours
  //     });

  //     res.status(200).send({ auth: true, token: token });
  //   }
  // );
});

router.get("/me", VerifyToken, function (req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });
});

module.exports = router;
