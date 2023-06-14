const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email'
},
function(email, password, done){

    //find a user and establish the identity
    User.findOne({email:email})
    .then(function(user){
        if(!user || user.password != password){
            console.log('Invalid Username/Password');
            return done(null, false);
        }
        return done(null, user);
    })
    .catch(function(err){
        console.log('Error in finding user-->Passport');
        return done(err);
    })
}

));

//seralizing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    Promise.resolve(user.id)
      .then(function(userId) {
        done(null, userId);
      })
      .catch(function(err) {
        done(err);
      });
  });
  
//deseralizing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        console.log('Error in finding user--> Passport');
        done(err);
      });
  });

  //check if the user is authenticated
  passport.checkAuthentication = function(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
  }

  passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
  }
  

module.exports=passport;