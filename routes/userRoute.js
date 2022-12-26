const router = require("express").Router()
const userController = require("../controller/userController")
const { userValidation, validation, passwordValidation } = require("../utils/validator")

router.post('/user',userValidation,validation,userController.userRegister)
router.post('/confirmation/:token',userController.postEmailVerification)
router.post('/forgetPassword',userController.forgetPassword)
router.post('/resendverification',userController.resendVerificationLink)
router.post('/signin',userController.signIn)
router.put('/resetpassword/:token',passwordValidation,validation,userController.resetPassword)
router.post('/signout',userController.signOut)
router.get('/userList',userController.requireSignin,userController.userList)
router.get('/userList/:id',userController.singleUser)
module.exports = router