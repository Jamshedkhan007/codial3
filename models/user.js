const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR = path.join('/upload/user/avatar');
const crypto=require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    token:{
        type:String,
        default:''
    },
    friendship:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendship'
        }
    ]
},
    {
        timestamps: true
    });


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', AVATAR));
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// Static method
const maxsize=10*1024*1024 //10mb
userSchema.statics.uploadedAvatar = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"||
            file.mimetype == "image/gif"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("only jpg, png and jpeg format"))
        }
    },
    limits:{
        fileSize:maxsize
    }
}).single('avatar');
userSchema.statics.avatarPath = AVATAR;

const User = mongoose.model('User',userSchema);

module.exports = User;