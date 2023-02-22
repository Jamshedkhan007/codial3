const mongoose = require('mongoose');

const friendSchema=new mongoose.Schema({
    // the user whos sent this request
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // the user who accepted this request the naming is just to undersatnd otherwise the wont see a difference
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

},{
    timestamps:true
});

const Friendship=mongoose.model('Friendship',friendSchema);
module.exports=Friendship;