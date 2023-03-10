const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like')


module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            // post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'post Created!'
            })
        }

        req.flash('success', 'Post Created Successfully')
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

// Deleting a post
module.exports.delete = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id)

        // .id means converting the object id into string
        if (post.user == req.user.id) {


            // CHANGE::delete the associated likes for the post and all its comment like too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } })

            post.remove();

            await Comment.deleteMany({
                post: req.params.id
            });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
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

