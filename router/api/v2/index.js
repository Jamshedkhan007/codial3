const express=require('express');

const router=express.Router();

router.use('/posts1',require('./posts1'));

module.exports=router;