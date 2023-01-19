const express = require('express');
const router = express.Router();
const {protect, authorizeRoles} = require('../middleware/auth.js');
const {registerUser, loginUser, logout, getUsers, getUser,updateUser,updatePassword, logInStatus, getAccountDetails} = require('../controllers/userController.js')

// router.route('/').get(registerUser)
router.get('/get-users',protect,authorizeRoles("admin"), getUsers)
router.get('/get-user',protect, getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logout)

router.get('/loggedin',logInStatus)
router.patch('/update-user', protect, authorizeRoles("admin"), updateUser)
router.patch('/update-password', protect, updatePassword)
router.get('/get-account-details', protect, getAccountDetails)


module.exports = router