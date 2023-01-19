const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({

    transactionId: {
        type: Number,
        required: [true],
        default: Math.round(Math.random() * (1000008 - 19999999) + 19999999)
    },
    transactionType: {
        type: String,
        enum: ['Debit', 'Credit'],
        required: true,
        default: "Debit"
    },
    senderAccountBalance: {
        type: Number,
        required: [true]
    },
    senderName: {
        type: String,
        required: [true, 'kindly Provide A Name']
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    beneficiaryAccountNumber: {
        type: Number,
        required: [true],
        
    },
    
    beneficiaryBankName: {
        type: String,
        required: [true],
        
    },

    amount: {
        type: Number,
        required: [true, "Please add Amount"],
    },

    fundtransferOption: {
        type: String,
        required:true, enum:['International', 'Local'],
        default: 'Local'
        
    },
    IBAN: {
        type: String,
    },
    swift: {
        type: String,
        required: [true, "Please provide swift."],
    },
    desc: {
        type: String,
    },
    date: {
        type: Date,
        required: [true, "Date is not added"],
        default: Date.now()
    }

},
{
    timeStamps: true
});




const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction