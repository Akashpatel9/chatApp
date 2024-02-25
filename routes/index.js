var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
const messageModel = require('./message')
const localStrategy = require("passport-local");
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/register', async(req, res) => {
  var userdata = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), (req, res) => { })

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const LoggedInUserData = await userModel.findOne({
    username:req.session.passport.user
  }).populate('Friends');
  console.log(LoggedInUserData);
  res.render('index',{LoggedInUserData});
});

router.get('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  })
})

router.get('/getUserData', isLoggedIn ,async(req,res)=>{
  const data = await userModel.findOne({username:req.session.passport.user}).populate('Friends');
  res.status(200).json(data);
})

router.post('/searchUser', isLoggedIn, async(req,res)=>{
  const alluser = await userModel.find({username:{
    $regex:req.body.data,
    $options:'i'
  }})
  res.status(200).json(alluser)
})

router.post('/addFriend', isLoggedIn, async(req,res)=>{
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  if(req.body.id != user._id && !user.Friends.includes(req.body.id)){
    user.Friends.push(req.body.id);
    user.save();
  }
  res.status(200);
})

router.get('/getAllMessgaes', isLoggedIn , async(req,res)=>{
  const data = await userModel.findOne({username:req.session.passport.user}).populate('messages');
  res.status(200).json(data);
})

// router.post('/imageUpdate', upload.single('image'),isLoggedIn,async(req,res)=>{
//   await userModel.findOneAndUpdate({username:req.session.passport.user},{
//     profileImage:req.file.filename
//   })
//   res.status(200);
// })






function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
