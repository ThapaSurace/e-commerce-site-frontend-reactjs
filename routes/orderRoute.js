const {
  postOrder,
  orderList,
  orderDetails,
  updateStatus,
  userOrder,
  deleteOrder,
} = require("../controller/orderController");

const router = require("express").Router();

router.post("/postorder", postOrder);
router.get("/orderList", orderList);
router.get("/orderDetails/:id", orderDetails);
router.put("/updateStatus/:id", updateStatus);
router.get("/userOrders/:user", userOrder);
router.delete("/deleteOrder/:id", deleteOrder);

module.exports = router;
