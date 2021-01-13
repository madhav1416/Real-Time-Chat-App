const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({},(err,users)=>{
    if(err)
    return next(err);
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(users);
    }
  })
});

router.post('/register',(req,res,next)=>{
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.email) user.email = req.body.email;
        if (req.body.contact) user.contact = req.body.contact;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});
module.exports = router;
