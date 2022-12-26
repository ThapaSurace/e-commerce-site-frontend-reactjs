const mongoose = require('mongoose')
const Category = mongoose.Schema

const categorySchema = new Category({
  category_name:{
    type:String,
    require:true,
    trim:true,  //remove whitespace
    unique:true
  }
},{timestamps:true} //gives created at and update at time
)




module.exports = mongoose.model('Category',categorySchema)