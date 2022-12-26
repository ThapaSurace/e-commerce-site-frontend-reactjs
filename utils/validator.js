const { check, validationResult } = require("express-validator");
const User = require("../model/authModel")
exports.categoryValidation = [
  check("category_name", "Category name is required")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Category name must be atleast three character")
 ,
];

exports.productValidation = [
  check("product_name", "Product name is required")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Product name must be atleast three character"),
  check("product_price", "Product price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Product price must be numeric value"),
  check("countinStock", "Count in stock is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Count in stock must be numeric value"),
  check("product_description", "Product description is required")
    .notEmpty()
    .isLength({ min: 30 })
    .withMessage("Product description must be atleast 30 character"),
  check("category", "Category is required").notEmpty(),
];

exports.userValidation = [
  check("name", "name is required")
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("name must be atleast 2 character"),
  check("email", "email is requires")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(val=>{
      return User.findOne({email:val}).then(user=>{
        if(user){
          return Promise.reject("Email already exist")
        }
      })
    })
    ,
  check("username", "username is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("username must be atleast 5 character")
    .custom(val=>{
      return User.findOne({username:val}).then(user=>{
        if(user){
          return Promise.reject("username already exist")
        }
      })
    })
    ,
  check("password", "password is required").notEmpty()
    .matches(/[a-z]/)
    .withMessage("Password must be one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must be one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must be one numeric value")
    .matches(/[@$#-_/*&]/)
    .withMessage("Password must be one special character")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 charcter")
    .isLength({ max: 50 })
    .withMessage("Password must not excess 50 charcter"),
];

exports.passwordValidation = [
  check("password", "password is required").notEmpty()
    .matches(/[a-z]/)
    .withMessage("Password must be one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must be one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must be one numeric value")
    .matches(/[@$#-_/*&]/)
    .withMessage("Password must be one special character")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 charcter")
    .isLength({ max: 50 })
    .withMessage("Password must not excess 50 charcter"),
]

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({ error: errors.array()[0].msg }); // 0 means display single error...one error at a time
  }
};
