const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalPassport = require('passport-local-mongoose');
const User = new Schema({
    email : {
        type : "String",
        default  : ""
    },
    contact : {
        type : "String",
        default : "",
    }
});
User.plugin(LocalPassport);
module.exports = mongoose.model('User',User);