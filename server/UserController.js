const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
let User = require('./models/user');

const app = express();
app.use(session({ secret: 'sk', cookie: {} }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

requireLogin = async (req, res, next) => {
    if (!req.session.user) {
      res.sendStatus(401);
    } else {
      req.session.user = await User.findById(req.session.user._id);
      next();
    }
  }

requireReputation = (req, res, next) => {
    if (req.session.user.reputation < 100) {
      res.status(401).send('This operation require reputation > 100.');
    } else {
      next();
    }
  }

  
registerUser = async (req,res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        res.status(406).send('user email already exist, please pick another one.');
        return;
    }
    const user = new User({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    await user.save();
    res.sendStatus(201);
}

Login = async (req,res) => {
  const u = await User.findOne({ email: req.body.email });
  if (u) {
    let valid = bcrypt.compareSync(req.body.password, u.password);
    if (valid) {
      req.session.user = u;
      res.sendStatus(200);
    } else {
      res.status(401).send('Password is incorrect.');
    }
  } else {
    res.status(401).send('User not exist.');
  }
}

module.exports = {
    registerUser,
    requireLogin,
    requireReputation,
    Login
}
