const Transaction = require('../models/transactionModel.js')
var User = require('../models/userModel.js');

const asyncHandler = require('express-async-handler')


//@desc : make a transfer
//route: POST /api/v1/transactions
//access: user with id
const debitTransaction= asyncHandler(async(req,res) => {
    const sender = await User.findById(req.user._id)
    const {transactionId, transactionType, beneficiaryAccountNumber, beneficiaryBankName, amount, fundtransferOption, IBAN, swift, desc, date} = req.body
    console.log(sender, "The sender's detail")
    // validation

    if(!beneficiaryAccountNumber || !beneficiaryBankName || !amount || !swift){
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    
    // make debit
    if(sender && sender.accountBalance > amount){
        // const {transactionId, transactionType,  beneficiaryAccountNumber, beneficiaryBankName, amount, fundtransferOption, IBAN, swift, desc, date} = user
        
        


            const {accountBalance, totalDebitTransactions} = sender
        
            sender.accountBalance = Number(sender.accountBalance) - Number(req.body.amount)
            sender.totalDebitTransactions = Number(sender.totalDebitTransactions) - Number(req.body.amount)
            const updatedUser = await sender.save()

        //create transaction
        const transaction = await Transaction.create({
            transactionId, senderName: sender.name, transactionType, beneficiaryAccountNumber, beneficiaryBankName, amount, fundtransferOption, IBAN, swift, desc, date, senderAccountBalance: updatedUser.accountBalance, userid: req.user._id
        })
        // console.log(transaction, "transaction")
        res.status(201).json({
            status:'success!',
            transaction
        })
       
    }else{
        res.status(400)
        throw new Error("Insufficient Funds")
    }
    


}) 

//@desc : get all transactions
//route: GET /api/v1/transactions
//access: user with id/  admin
const getTransactions = asyncHandler(async(req,res) => {

    const transactions = await Transaction.find({}).sort({_id:-1})

    if(transactions){
        res.status(200).json({
            status: 'success',
            transactions
        })
    }else{
        res.status(400)
        throw new Error("Cannot Get transactions.")
    }
    

})

//@desc : get all transactions
//route: GET /api/v1/transactions
//access: user with id/  admin
const getUserTransactions = asyncHandler(async(req,res) => {
    console.log(req.user._id, "the request user")
    const transaction = await Transaction.find({userid: req.user._id})
    console.log(transaction, "my transactions")
    if(transaction){
        res.status(200).json({
            status: 'success',
            transaction
        })
    }else{
        res.status(400)
        throw new Error("Cannot Get transactions.")
    }
    

})


module.exports = {
    debitTransaction,
    getTransactions,
    getUserTransactions
}