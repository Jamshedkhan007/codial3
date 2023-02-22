const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailers');
const queue = require('../config/kue')
const commentWorker = require('../worker/comment_email_worker');
const Like = require('../models/like');
// const { post } = require('../router/posts');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function (err) {
                if (err) {
                    console.log("error in sending to the queue", err);
                }
                console.log('job enqueued', job.id)
            })
            if (req.xhr) {
                // similar for all comments fecth the users id's

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: 'post created !'
                })
            }
            req.flash('success', 'comments Created successfully');
            res.redirect('/');
        }

    } catch (err) {
        console.log("Error", err);
        return;
    }

}

// Deleting a Comment 
module.exports.deleteComment = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment.user) {

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            // CHANGE::Delete the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });


            // send the comment id which has deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment Deleted!'
                })
            }
            req.flash('error', 'comment are deleted')
            return res.redirect('back');

        }
        else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err)
        return res.redirect('back');
    }
}