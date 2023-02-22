const Post = require("../models/post");
const User = require("../models/user");


module.exports.home = async function (req, res) {
    try {
        // CHANGE::Populate the likes of each post and comment
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate:{
                    path:'likes'
                }
            }).populate('likes');

        let user = await User.find({});

        return res.render('home', {
            title: 'home',
            posts: posts,
            all_user: user
        });

    } catch (err) {
        console.log("Error", err);
        return;
    }
}