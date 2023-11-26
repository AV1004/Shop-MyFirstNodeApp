const Cart = require("../models/cart");
const Products = require("../models/product");

exports.getIndex = (req, res, next) => {
  Products.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Products.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Products.findById(prodId)
    .then(([product, fieldData]) => {
      res.render("shop/product-details", {
        prod: product[0],
        pageTitle: `Product${prodId}`,
        path: `/products`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCartProds((cartItems) => {
    Products.fetchAll((products) => {
      let CartProducts = [];
      if (cartItems.length !== 0) {
        for (i = 0; i < cartItems.products.length; i++) {
          products.map((p) => {
            if (p.id === cartItems.products[i].id) {
              CartProducts.push({ ...p, qty: cartItems.products[i].qty });
            }
            return 0;
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        prods: CartProducts,
        totalPrice: cartItems.totalPrice,
      });
    });
  });
};

exports.postProductInCart = (req, res, next) => {
  let prodId = req.body.productId;
  Products.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.removeProductFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  Cart.removeFromCart(prodId, prodPrice, false);
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
