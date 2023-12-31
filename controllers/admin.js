const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getAddPrducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const ProdId = req.body.productId;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
  const newPrice = req.body.price;
  const newDescription = req.body.description;
  Product.updateProduct(
    ProdId,
    newTitle,
    newImageUrl,
    newPrice,
    newDescription
  );
  res.redirect("/admin/admin-products-list");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  Product.delete(prodId);
  Cart.removeFromCart(prodId, prodPrice, true);
  res.redirect("/admin/admin-products-list");
};

exports.getProductsList = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/admin-products-list", {
        prods: rows,
        path: "/admin/admin-products-list",
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
