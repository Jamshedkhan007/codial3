const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env=require('./environment');


// Tell passport to using new strategy for google login
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secrect,
    callbackURL: env.google_callback_url
},
function(accessToken,refresToken,profile,done){
    // find the user
    User.findOne({
        email:profile.emails[0].value
    }).exec(function(err,user){
        if(err){
            console.log("Error in google Strategy-passport",err);
            return;
        }

        if(user){
            // If Found the user as req.user
            return done(null,user)
        }else{
            // If not found , create the user and set it to as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },
            function(err,user){
                if(err){
                    console.log("Error in creating the user google Strategy-passport",err);
                    return;
                }
                return done(null,user);
            }
            )
        }
    })
}
))