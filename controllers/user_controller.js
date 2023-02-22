const User = require('../models/user');
const passport = require('passport');
const fs = require('fs');
const path = require('path');


module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('profile', {
            title: 'user',
            profile_user: user
        })
    });
}
module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('*****multer Error : ', err) };

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving thr path  of the uploaded file into avatar field the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'UnAuthorized');
        return res.status(401).send('UnAuthorized')
    }
}



// Rendering the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }
    return res.render('sign-up', {
        title: 'sign-Up'
    })
}

// Rendering the sign in Page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }

    return res.render('sign-in', {
        title: 'Sign-in'
    });
}

// rendering the forgot page
module.exports.forgot=(req,res)=>{
    module.exports.signUp = function (req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/user/profile');
        }
        return res.render('forgot', {
            title: 'forgot'
        })
    }
}

// Geting the sign Up Data 
module.exports.create = function (req, res) {
    if (req.body.password != req.body.Confirm_password) {
        return res.redirect('back');
    }
    User.findOne({
        email: req.body.email
    },
        function (err, user) {
            if (err) {
                console.log("Error in findin gthe user in Sign Up");
                return
            }
            if (!user) {
                User.create(req.body, function (err, user) {
                    if (err) {
                        console.log("Error in creating user while Signing Up");
                        return
                    }
                    return res.redirect('/user/signin');
                })
            } else {
                return res.redirect('back');
            }
        }

    );
}

// Sign In Page
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/')
}

// Logout Seassoin
module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.log("error in sign Out");
            return next(err);
        }
        req.flash('error', 'You have Logged Out!')
        return res.redirect('/');
    })

}

//deleting the user
// Deleting a post
module.exports.deleteuser = async function (req, res) {
    try {
        let user = await Post.findById(req.params.id)

        // .id means converting the object id into string
        if (user.id == req.user.id) {


            // CHANGE::delete the associated likes for the post and all its comment like too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } })

            user.remove();

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        user_id: req.params.id
                    },
                    message: 'post Deleted'
                })
            }
            req.flash('success', 'post and comments are deleted');
            return res.redirect('back');
        }
        else {
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err)
        return res.redirect('back');
    }

}




























































// // step to authenticate
// // find the user
// User.findOne({
//     email: req.body.email
// },
//     function (err, user) {
//         if (err) {
//             console.log("Error finding in user in signing");
//             return;
//         }
//         // handle user found
//         if (user) {

//             // handle if password doesnt match
//             if (user.password != req.body.password) {
//                 return res.redirect('back');
//             }
//             // handle the session Creation
//             res.cookie('user_id', user.id);
//             return res.redirect('/user/profile');
//         }
//         else {
//             return res.redirect('back');
//         }
//     }
// )