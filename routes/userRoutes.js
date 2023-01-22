const express = require('express');
const router = express.Router();
const {protect, authorizeRoles} = require('../middleware/auth.js');
const {registerUser, loginUser, logout, getUsers, getUser,updateUser,updatePassword, logInStatus, getAccountDetails} = require('../controllers/userController.js')

// router.route('/').get(registerUser)
router.get('/getusers',protect,authorizeRoles("admin"), getUsers)
router.get('/getuser',protect, getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logout)

router.get('/loggedin',logInStatus)
router.patch('/updateuser', protect, authorizeRoles("admin"), updateUser)
router.patch('/updatepassword', protect, updatePassword)
router.get('/getaccountdetails', protect, getAccountDetails)


module.exports = router