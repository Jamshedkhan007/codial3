const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_controller');


router.get('/profile/:id',passport.checkAuthentication, userController.profile);

router.post('/update/:id',passport.checkAuthentication,userController.update);

router.get('/signup', userController.signUp);

router.get('/signin', userController.signIn);

router.get('/forgot',userController.forgot);

// router.post('/forgot',userController.forgotPass);

// router.get('/reset',userController.reset);

// router.post('/reset',userController.resetPass);




// User Sign Up
router.post('/create', userController.create);

// User Login 
// router.post('/create-session',userController.createSession);

// use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    { failureRedirect: '/user/signin' },), userController.createSession);


// logout session
router.get('/signout',userController.destroySession);


// Using Google as a middleware to authenticate
router.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}));
router.get('/auth/google/callback',passport.authenticate('google',{
    failureRedirect:'/user/signin'
}),
userController.createSession
);

module.exports = router;