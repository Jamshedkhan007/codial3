const passport = require('passport');
const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
},
    function (req,email, password, done) {
        // find the user and establish the identity
        User.findOne({
            email: email
        },
            function (err, user) {
                if (err) {
                    req.flash("Error",err)
                    return done(err);
                }
                if (!user || user.password != password) {
                    req.flash('error','Invalid username/Password');
                    return done(null, false);
                }
                // if the user found
                return done(null, user);
            }
        );
    }

));

// serializing the user to decide which key is to kept in the cookies
passport.serializeUser(function(user,done){
    // it store the user id in encrepted format
    done(null,user.id);

});

// deserializing the user from the key in cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("error in the Finding the Error")
            return done(err);
        }
        return done(null,user);
    })
});


// check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in 
    return res.redirect('/user/signin');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;  
    }
    next();
}

module.exports=passport;