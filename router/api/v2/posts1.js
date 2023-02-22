const express=require('express');

const router=express.Router();
const postApi1=require('../../../controllers/api/v2/post1_api');

router.get('/',postApi1.index);

module.exports=router;