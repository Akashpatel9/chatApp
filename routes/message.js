const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender:String,
    user:String,
    data:String
})

module.exports = mongoose.model("message",messageSchema);