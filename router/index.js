const express=require('express');

const router=express.Router();
const homeController=require('../controllers/home_controller');

console.log('Router Reloaded');

router.get('/',homeController.home);
router.use('/user',require('./user'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comment'));
router.use('/likes',require('./likes'));



// export the api
router.use('/api',require('./api'));

module.exports=router;