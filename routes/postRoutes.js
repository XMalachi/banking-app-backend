const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth.js');
const {getPosts, postData, updatePost, deletePost} = require('../controllers/postControllers.js');

// import {protect} from '../middleware/auth.js'


router.route('/').get(getPosts).post(protect, postData)
router.route('/:id').put(protect, updatePost).delete(protect, deletePost)

// .post(createPost);
// //get post
// router.route('/:id')
//         .get(getSinglePost) 
//         .put(updatePost)
//         .delete(deletePost);


//other way of doing same thing
// router.get('/', (req,res){
    
// })

module.exports =  router
