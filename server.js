const express = require('express')
const app = express()
const cors = require("cors")
require('dotenv').config()
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 4000

//connect db
connectDB();

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json())


app.use(bodyParser.urlencoded({ extended: true }));


//morgan middleware
app.use(morgan('dev')) // use only in development mode
app.use('/public/uploads',express.static('public/uploads'))
app.use(cookieParser()) 

//routes middleware
app.use('/api',require('./routes/category'))
app.use('/api',require('./routes/product'))
app.use('/api',require("./routes/userRoute"))
app.use('/api',require("./routes/orderRoute"))
app.use('/api',require("./routes/paymentRoute"))




mongoose.connection.once('open',()=>{
    console.log("Connected to mongo db")
    app.listen(PORT, ()=> console.log(`Server running: http://localhost:${PORT}`))
 })
 