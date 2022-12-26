const Product = require("../model/productModel");

//to store product

exports.createNewProduct = async (req, res) => {
  
    let result = await Product.create({
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      countinStock: req.body.countinStock,
      product_description: req.body.product_description,
      product_image: req.file.path,
      category: req.body.category,
      product_rating: req.body.product_rating
    });
    if(!result){
      res.status(400).json({error:"Something is misssing"})
    }else{
      res.status(200).send(result)
    }
};


// to show all product detail
exports.getAllProduct = async (req,res) =>{
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.order ? req.query.sortBy : '_id'
  let limit = req.query.order ? parseInt(req.query.limit) : 100

    const product = await Product.find()
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    if(!product) return res.status(400).json({error:"Product Not found"})
    res.send(product)
}

// to show single product details
exports.getProduct= async (req,res) =>{
    const product = await Product.findById(req.params.id).populate('category')
    if(!product) return res.status(400).json({error:"Product not found"})
    res.send(product)
}

// to update product
exports.updateProduct = async (req,res) =>{
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            countinStock: req.body.countinStock,
            product_description: req.body.product_description,
            product_image: req.body.product_image,
            category: req.body.category,
            product_rating: req.body.product_rating
        },
        {new:true}
        )

        if(!product) return res.status(400).json({error:"Product not found"})

        res.status(200).send(product)
} 

// to delete product
exports.deleteProduct = async (req,res) =>{
    const product = await Product.findByIdAndRemove(req.params.id)
    if(!product) return res.status(400).json({error:'Product Not Found'})
    res.status(200).send(product)
}

// products related to same category
exports.listRelated = async (req,res) => {
  // dont show same product in related list
  let singleProduct = await Product.findById(req.params.id)

  let limit = req.query.limit ? parseInt(req.params.limit):6

  let product = await Product.find({_id:{$ne:singleProduct},category:singleProduct.category}) // ne = not equal
  .limit(limit)
  .populate('category','category_name')
  if(!product) return res.status(400).json({error:'Product Not Found'})
  res.status(200).send(product)
}

// filter by category and price range
exports.listBySearch = async (req,res) => {
  let order = req.body.order ? req.body.order : 'desc'
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
  let limit = req.body.limit ? parseInt(req.body.limit)  : 200
  let skip = parseInt(req.body.skip)
  let findArgs={}

  for(let key in req.body.filters){
    if(req.body.filters[key].length > 0){
      if(key === 'product_price'){
        //gte== greater than
        //lte == less than
        findArgs[key]={
          $gte:req.body.filters[key][0],
          $lte:req.body.filters[key][1]
        }
      }
      else{
        findArgs[key] = req.body.filters[key]
      }
    }
  }
  const product = await Product.find(findArgs)
  .populate('category')
  .sort([[sortBy,order]])
  .limit(limit)
  .skip(skip)

  if(!product){
    return res.status(400).json({error:"Something went wrong"})
  }

  res.json({
    size:product.length,
    product
  })
}