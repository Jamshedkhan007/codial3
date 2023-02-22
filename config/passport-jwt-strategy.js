const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const env=require('./environment');

const User=require('../models/user');


let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_secrect_key
}

passport.use(new JWTStrategy(opts,function(payLoad,done){
    User.findById(payLoad._id, function(err,user){
        if(err){
            console.log("Error to finding the user in JWT");
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    });
}));


module.exports=passport;