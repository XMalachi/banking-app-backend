const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const path = require('path');
// const PostRoutes = require('./routes/PostRoutes');
const errorHandler = require("./middleware/errorMiddleware.js");
const cookieParser = require("cookie-parser");

const app = express()
app.use(cookieParser())
// middlewares
app.use(express.json({limit:'50mb'}))
app.use(
    cors({
      origin: ["http://localhost:3000", "https://eastdalefinance.onrender.com"],
      credentials: true,
    })
  );
app.use(express.urlencoded({extended:  false}))
app.use(express.static(path.join(__dirname, 'build')));



app.use(bodyParser.json())

app.use(morgan('dev'))


// app.use('/api/posts', PostRoutes)
// routes
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public'));
// });
app.get('/', (req, res) => {
    res.send("Welcome Page")
    console.log(req.cookies, "request cookies")
})

const PORT =  process.env.PORT || 5000

//  error middleware 
app.use(errorHandler);

// routes middleware
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)
// connect to DBB and start server
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`server running on Port ${PORT}`)
    })
})
.catch((err) => {
    console.log(err)
})
