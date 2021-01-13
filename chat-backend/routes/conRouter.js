const express = require('express');
const bodyParser = require('body-parser');
const Conversation = require('../models/conversations');
const Route = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
Route.use(bodyParser.json());

Route.route('/:id')
.get((req,res,next)=>{
    Conversation.find({})
    .populate('sender')
    .populate('receiver')
    .then((con)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(con);
    },err=>next(err))
    .catch(err=>next(err));
})
.post((req,res,next)=>{
    req.body.sender = req.params.id;
    Conversation.create(req.body)
    .then((con) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(con);
      }, (err) => next(err))
      .catch((err) => next(err));
});

Route.route('/')
.get((req,res,next)=>{
    Conversation.find({})
    .populate('sender')
    .populate('receiver')
    .then((con)=>{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(con);
    },err=>next(err))
    .catch(err=>next(err));
})
module.exports = Route;