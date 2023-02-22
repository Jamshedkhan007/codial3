const nodemailer = require('../config/nodemailer');

// another way to exporting a method
exports.newComment = (comment) => {
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: 'Khanjamshed123@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
        html:htmlString
    }, (err, info) => {
        if (err) { 
            console.log('Error in send mail', err);
             return; 
            }

        // console.log('message sent ', info);
        return;
    });
}