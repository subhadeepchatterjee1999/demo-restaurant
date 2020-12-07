var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var ejs = require("ejs");
var mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//=============================
//=          ROUTS            =
//=============================
app.get("/", function (req, res){
  res.render("home");
});
app.get("/home", function (req, res){
  res.render("home");
});
app.get("/login", function (req, res){
  res.render("Login");
});
app.get("/register", function (req, res){
  res.render("register");
});

app.post("/home", function(req, res){
  const email = new emaildb({
    uemail: req.body.user_email
  });
  email.save(function(err){
    if(!err){
      res.render("home");
    }
    else{
      console.log(err);
      res.render("home");
    }
  });
});

app.get("/about", function (req, res){
  res.render("about");
});

app.get("/places", function (req, res){
  res.render("places");
});
app.get("/galery", function (req, res){
  res.render("galery");
});

let port = process.env.PORT;
if(port == null || port == ""){
	port = 8000;
}
app.listen(port, function(){
  console.log("website started");
});
