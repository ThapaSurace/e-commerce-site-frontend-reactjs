const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema // to get reference

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400 // for 1 day
    }
})

module.exports = mongoose.model("Token",tokenSchema)