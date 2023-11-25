const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const getCartItemsFromFile = (CB) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      CB([]);
    } else {
      CB(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // Fetch the previous cart
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //    Anlayze the cart => Find the Exisiting Porduct
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const exisitingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //   Add a new Product / Increase Quantity
      if (exisitingProduct) {
        updatedProduct = { ...exisitingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static getCartProds(CB) {
    getCartItemsFromFile(CB);
  }

  static removeFromCart(id, price, deleteByAdmin) {
    getCartItemsFromFile((cartItems) => {
      let cart = cartItems;
      const removeProdPrice = price;
      const productIndex = cart.products.findIndex((p) => p.id === id);
      const removeProdQty = cart.products[productIndex].qty;

      if (!deleteByAdmin) {
        if (removeProdQty > 1) {
          cart.products[productIndex].qty = removeProdQty - 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
        cart.totalPrice = cart.totalPrice - removeProdPrice;
      } else {
        cart.products.splice(productIndex, 1);
        cart.totalPrice = cart.totalPrice - removeProdQty * removeProdPrice;
      }

      if (cart.products.length === 0) {
        cart.totalPrice = 0;
      }

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
