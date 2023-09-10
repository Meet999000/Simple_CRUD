const express = require("express");
const router = express.Router();
const Customer = require("../controllers/customer");

router.route("/add-customer").post(Customer.addCustomer);

module.exports = router;
