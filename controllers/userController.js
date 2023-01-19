var mongoose = require('mongoose');
var User = mongoose.model('User');
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')

const JWT = require('jsonwebtoken')


const generateToken = (id)=> {
    // console.log("process env",process.env.MAILJET_API_SECRET,)
    return JWT.sign({id}, process.env.JWTSECRET, {expiresIn:'1d'})
}


//@desc : get all user
//route: GET /api/v1/users
//access: privite - admin only
const getUsers = asyncHandler(async(req,res) => {

        // res.send('get all users')
        const users = await User.find({}).sort({_id:-1})

        if(users){
            res.status(200).json({
                status: 'success',
                users
            })
        }else{
            res.status(400)
            throw new Error("Cannot Get Users.")
        }
        
    
})


//@desc : get single user
//route: GET /api/v1/user
//access: privite - admin and client
const getUser = asyncHandler(async(req,res) => {
    // res.send('get all users')
    console.log(req.user._id, "request id")
    const user = await User.findById(req.user._id)
    // register the user
    if(user){
        const {_id, loginid, accountNumber ,name,email, phone, gender, birthday, address, country, occupation, account, photo, role} = user
        res.status(200).json({
            status:'Found!!!',
            user:{
                _id,
                account,
                loginid, accountNumber,
                email,
                name, phone, gender, birthday, address, country, occupation, account, photo, role
            }
        })
        console.log(loginid , "user_id")
        
    }else{
        res.status(400)
        throw new Error("User Not Found")
    }
    
})


//@desc : create user
//route: POST /api/v1/users/register
//access: public 
const registerUser= asyncHandler(async(req,res) => {
    const {loginid, accountNumber , name, email, password, phone, gender, birthday, address, country, occupation, account, photo, role} = req.body

    // validation
    if(!name || !email || !password || !phone || !gender || !birthday || !address || !country || !occupation){
        res.status(400)
        throw new Error("Please fill in all required fields")
    }

    if(password.length < 6) {
        res.status(400)
        throw new Error("Password must be up to Six characters.")
    }
    //check that user does not exist
    const userExist = await User.find({email})
    console.log(userExist, "user_exist")
    if(userExist.length > 0){
        throw new Error('Email already exist')
    }
    
    //create user
    const user = await User.create({
        loginid, accountNumber ,name,email, password, phone, gender, birthday, address, country, occupation, account, photo, role
    })

    // generate token (signin on registeration)
    const token = generateToken(user._id);
    
    // send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400) ,
        sameSite: "none",
        secure: true
    });

    // register the user
    if(user){
        const {_id, loginid, accountNumber ,name,email, phone, gender, birthday, address, country, occupation, account, photo, role, } = user
        res.status(201).json({
            status:'success, please copy your account number',
            user:{
                _id,
                account,
                loginid, accountNumber ,
                email,
                name, phone, gender, birthday, address, country, occupation, account, photo, role,token
            }
        })
        console.log(loginid, accountNumber , "user_id")
        
    }else{
        res.status(400)
        throw new Error("invalid User data")
    }
    


}) 

//@desc : login user
//route: POST /api/v1/users/login
//access: public 
const loginUser = asyncHandler(async(req,res) => {
    const {loginid, password} = req.body

    // validate Request
    if(!loginid || !password) {
        res.status(400);
        throw new Error("Please add id and password")
    }

    //check that user exist
    const user = await User.findOne({loginid})
    console.log(user, "the user")
    if(!user){
        res.status(400)
        throw new Error('User does not exist, pls register')
    }

    // user exists
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
     
    // generate token (signin on registeration)
    const token = generateToken(user._id);
    
    // send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400) ,
        sameSite: "none",
        secure: true
    });


    if(user && passwordIsCorrect){
        
        const {_id, loginid, accountNumber ,name,email, phone, gender, birthday, address, country, occupation, account, photo, role} = user
        res.status(200).json({
            status:'success',
            user:{
                _id,
                account,
                loginid, accountNumber ,
                email,
                name, phone, gender, birthday, address, country, occupation, account, photo, role, token
            }
        })
        console.log(loginid, accountNumber , "user_id")
        
    }else{
        res.status(400)
        throw new Error("invalid id or password")
    }
    
})

//@desc : login status
//route: GET /api/v1/users/loggedin
//access: public 

const logInStatus = asyncHandler(async(req, res)=> {
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        const token = req.headers.authorization.split(' ')[1]

        if(!token){
            return res.json(false)
        }
        // verify token
            
        const verified = JWT.verify(token, process.env.JWTSECRET)
    
        if(verified){
            res.json(true);
        }
        return res.json(false)
    }
    
    return res.json(false)
})

//@desc : logout user
//route: GET /api/v1/users/logout
//access: public 


const logout = asyncHandler(async(req, res) => {
    
    // send HTTP-only cookie
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0) ,
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({
        message: "Successfully Logged Out"
    })
})

//@desc :update user informaation
//route: GET /api/v1/users/update-user
//access: public 

const updateUser = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id)
    if(user){
        const {loginid, accountNumber ,name,email, phone, gender, birthday, address, country, occupation, account, photo, role} = user

    
        user.role = role
        user.account = account
        user.loginid = loginid
        user.accountNumber = accountNumber
        user.email = email
        user.name = req.body.name || name
        user.phone = req.body.phone || phone
        user.gender = req.body.gender || gender
        user.birthday = req.body.birthday || birthday
        user.address = req.body.address || address
        user.country = req.body.country || country
        user.occupation = req.body.occupation || occupation
        user.photo = req.body.photo || photo

        const updatedUser = await user.save()

        res.status(200).json({
            loginid: updatedUser.loginid,
            accountNumber : updatedUser.accountNumber,
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            birthday: updatedUser.birthday,
            address: updatedUser.address,
            country: updatedUser.country,
            occupation: updatedUser.occupation,
            account: updatedUser.account,
            photo: updatedUser.photo,
            role: updatedUser.role,
        })
    }else{
        res.status(404)
        throw new Error("User not found.")
    }

    

})

//@desc : update password
//route: GET /api/v1/users/update-password
//access: public 

const updatePassword = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id)
    const {password} = req.body
    if(!user){
        res.status(404)
        throw new Error("User not found. Please Sign Up")
    }
    if(!password){
        res.status(400)
        throw new Error("Please Provide a Password")
    }
    if(user){


        const {password} = user
    
        user.password = req.body.password || password

        const updatedUser = await user.save()

        res.status(200).json({
            message: "Password change Successful.",
        })
    }else{
        res.status(400)
        throw new Error("Password Cannot Be reset.")
    }

    

})

const getAccountDetails = asyncHandler(async(req, res) => {

    const user = await User.findById(req.user._id)
    
    if(!user){
        res.status(400)
        throw new Error('User does not exist, pls register')
    }

    
    if(user){
    const {name,accountNumber, accountBalance, totalCreditTransactions, totalDebitTransactions, loanCounter, enrolledCards, totalTransactions, totalTransfers} = user
        
        res.status(200).json({
            status:'success',
            user:{
                accountOwner:  name,
                accountBalance,
                accountNumber,
                totalCreditTransactions,
                totalDebitTransactions,
                loanCounter, enrolledCards,
                totalTransactions,
                totalTransfers
            }
        })
        
    }else{
        res.status(400)
        throw new Error("Cannot Get account Details. Check If you are Logged In.")
    }
    

})
module.exports = { getUsers,getUser, registerUser, loginUser, logInStatus, updateUser, updatePassword,getAccountDetails, logout}
