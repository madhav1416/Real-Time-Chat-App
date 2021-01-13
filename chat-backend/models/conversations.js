const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConSchema = new Schema({
    message : {
        type : "String",
        required : true
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    createAt : {
        type : Date,
        default : Date.now()
    }
},{
    timestamps : true,
});

module.exports = mongoose.model('Conversation', ConSchema);