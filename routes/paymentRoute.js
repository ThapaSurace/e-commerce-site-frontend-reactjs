const router = require("express").Router()
const { processPayment, sendStripeApi } = require("../controller/paymentController")
const { requireSignin } = require("../controller/userController")

router.post('/payment/process',requireSignin,processPayment)
router.get("/stripeapi",sendStripeApi)

module.exports = router