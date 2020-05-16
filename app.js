//jshint esversion:6
const express= require('express');
const bodyparser =require('body-parser');
const ejs=require('ejs');
const app=express();
const mongoose= require('mongoose');
const encrypt= require('mongoose-encryption');

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB',{ useNewUrlParser: true , useUnifiedTopology: true});
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret= "thisisasecretmessage";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const User=new mongoose.model('User',userSchema);

app.get('/',function(req,res){
  res.render("home");
});
app.get('/login',function(req,res){
  res.render("login");
});
app.get('/register',function(req,res){
  res.render("register");
});

app.post('/register',function(req,res){
  const user= new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if (err) {
       console.log(err);
    }else {
          res.render('secrets');
    }
  });
});
app.post('/login',function(req,res){
  const username= req.body.username;
  const password= req.body.password;

  User.findOne({email: username}, function(err,foundUser){
    if (err) {
      console.log(err);
    }else {
      if (foundUser) {
        if(foundUser.password === password){
            res.render('secrets');
      }
    }
  }
  });
});

app.listen('3000',function(){
  console.log("server is running at port 3000 ");
});
