const express = require("express");

const router = express.Router();

const adminControllers = require("../controllers/admin");

// /admin/add-product => GET
router.get("/add-product", adminControllers.getAddPrducts);

// /admin/admin-prodcuts-list
router.get("/admin-products-list", adminControllers.getProductsList);

// /admin/add-product => POST
router.post("/add-product", adminControllers.postAddProducts);

router.get("/edit-product/:productId", adminControllers.getEditProduct);

router.post("/edit-product", adminControllers.postEditProduct);

router.post("/delete-product", adminControllers.postDeleteProduct);

exports.routes = router;
