const express = require("express");
const router = express.Router();
const Customer = require("../controllers/customer");

// Post method
router.route("/add-customer").post(Customer.addCustomer);

// Get method
router.route("/search-customer").get(Customer.searchCustomer);
router.route("/get-customer-by-id/:id").get(Customer.getCustomer);
router.route("/get-city-info").get(Customer.getCityInfo);

module.exports = router;
