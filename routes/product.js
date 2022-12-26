const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const { requireSignin } = require('../controller/userController')
const upload = require('../middleware/fileUpload')
const { productValidation, validation } = require('../utils/validator')



router.route('/product')
.post(upload.single('product_image'),requireSignin,productValidation,validation,productController.createNewProduct) //single means only one image to be upload...use multiple for multile image
.get(productController.getAllProduct)

router.route('/product/:id')
.get(productController.getProduct)
.put(productController.updateProduct)
.delete(productController.deleteProduct)

router.get('/listrelated/:id',productController.listRelated)

router.post('/products/by/search',productController.listBySearch)


module.exports = router