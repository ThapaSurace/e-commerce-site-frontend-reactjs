
const Category = require("../model/categoryModel");

// create new category or post
exports.createNewCategory = async (req, res) => {
    const {category_name} = req.body
    const foundCategory = await Category.findOne({category_name:category_name}).exec()
    if(foundCategory) return res.status(400).json({error:"Category name already present"})
    
    const result = await Category.create({
     
        category_name:category_name
    })
    if(!result) return res.status(400).json({error:"category not found"})
    res.send(result)
};

// getting all category from db 
exports.getAllCategory = async (req,res) => {
    const category = await Category.find()
    if(!category) return res.status(400).json({error:"category not found"})
    res.send(category)
}

// getting single category from db 
exports.getCategory = async (req,res) => {
    const category = await Category.findById(req.params.id)
    if(!category) return res.status(400).json({error:"category not found"})
    res.send(category)
}


exports.updateCategory = async (req,res) => {
    const category =  await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name:req.body.category_name
        },
        {new:true} //show update data
    )
    if(!category) return res.status(400).json({error:"category not found"})
    res.send(category)
}

exports.deleteCategory = (req,res) =>{
    Category.findByIdAndRemove(req.params.id)
    .then(category =>{
       if(!category){
        return res.status(403).json({error:'Category not found'})
       }else{
        return res.status(200).json({message:'category deleted'})
       }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}

