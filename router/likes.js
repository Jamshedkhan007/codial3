const express=require('express');

const router=express.Router();

const likeController=require('../controllers/like_controller');

router.get('/toggle',likeController.toggleLike);

module.exports=router;