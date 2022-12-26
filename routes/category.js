const express = require('express')
const { createNewCategory, getAllCategory, getCategory, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireSignin } = require('../controller/userController')
const { categoryValidation, validation } = require('../utils/validator')
const router = express.Router()



router.route('/category')
.post(requireSignin,categoryValidation,validation,createNewCategory)
.get(getAllCategory)

// to get single category by id
router.route('/category/:id')
.delete(requireSignin,deleteCategory)
.put(requireSignin,categoryValidation,validation,updateCategory)
.get(getCategory)

module.exports = router