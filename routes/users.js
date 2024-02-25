const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/ChatAppData");

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  profileImage: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  sockedId: String,
  Friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }],
  messages:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"message"
  }]
})

UserSchema.plugin(plm);

module.exports = mongoose.model("user", UserSchema);