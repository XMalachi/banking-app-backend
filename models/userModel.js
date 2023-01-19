const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")



const userSchema = new mongoose.Schema({
    loginid: {
        type: Number,
        index: { unique: true, sparse: true },
        required: [true],
        default: Math.round(Math.random() * (11999999999 - 11000000000) + 11000000000)
        
    },
    accountNumber: {
        type: Number,
        index: { unique: true, sparse: true },
        required: [true, "Please provide account number"],
        default: Math.round(Math.random() * (71999999999 - 71000000000) + 71000000000)
        
    },
    name: {
        type: String,
        required: [true, 'kindly Provide A Name']
    },

    email:{
        type: String,
        required: [true, 'kindly Provide A Name'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "kindly enter a valid email"
        ]
    },
    password: {
        type: String,
        required:[ true, "kindly Add a Paasword"],
        minLength: [6, "Password must be up to 6  characters"],
        // maxLength: [26, "Password must not be up to 26  characters"]
    },
    
    phone: {
        type: String,
        default: '+234'

    },
    gender: {
        type: String,
        required: [true, 'kindly Provide Your Gender'],
        default: ''

    },
    birthday: { type: Date, required: [true, "Kindly Provide Your Birthday"] },
    address: {
        type: String,
        required: [true, 'kindly Provide Your Address'],
    },
    country: {
        type: String,
        required: [true, 'kindly Provide Your Country'],
    },
    occupation: {
        type: String,
        required: [true, 'kindly Provide Your Occupation'],
    },
    account: {
        type: String,
        required: [true, 'kindly Provide Your Account Type'],
        default: "Savings"
    },
    
    photo: {
        type: String,
        required: [true, 'kindly Provide A Photo'],
        default: 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'

    },
    
    accountBalance: {
        type: Number,
        required: [true],
        default: 0
    },
    totalCreditTransactions: {
        type: Number,
        required: [true],
        default: 0
    },
    totalDebitTransactions: {
        type: Number,
        required: [true],
        default: 0
    },
    loanCounter: {
        type: Number,
        required: [true],
        default: 0
    },
    enrolledCards: {
        type: Number,
        required: [true],
        default: 0
    },
    totalTransactions:{
        type: Number,
        required: [true],
        default: 0
    },
    totalTransfers:{
        type: Number,
        required: [true],
        default: 0
    },
    role:{type:String, required:true, enum:['customer', 'admin', 'superadmin'], default:'customer'},
},
{
    timeStamps: true, toJSON: { virtuals: true }
}
);

userSchema.virtual("Transactions", {
    ref: "Trasactions",
    foreignField: "userId",
    localField: "_id"
  });

// encrypt paassword before saving to DB
userSchema.pre("save", async function(next) {

    if(!this.isModified("password")){
        return next()
    }

    // Hash password
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword =  await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User