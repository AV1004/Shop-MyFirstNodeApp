const Cart = require("../models/cart");
const Products = require("../models/product");

exports.getIndex = (req, res, next) => {
  Products.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Products.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Products.findById(prodId, (product) => {
    res.render("shop/product-details", {
      prod: product,
      pageTitle: `Product${prodId}`,
      path: `/products`,
    });
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
