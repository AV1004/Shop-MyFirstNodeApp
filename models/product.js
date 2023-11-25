const fs = require("fs");
const path = require("path");
const { title } = require("process");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProdcutsFromFile = (CB) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      CB([]);
    } else {
      CB(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProdcutsFromFile((products) => {
      this.id = Math.random().toString();
      products.push({
        id: this.id,
        title: this.title,
        imageUrl: this.imageUrl,
        price: this.price,
        description: this.description,
      });

      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(CB) {
    getProdcutsFromFile(CB);
  }

  static findById(id, CB) {
    getProdcutsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      CB(product);
    });
  }

  static updateProduct(id, title, imageUrl, price, description) {
    const updateProduct = {
      id: id,
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    };
    getProdcutsFromFile((products) => {
      const productIndex = products.findIndex((p) => p.id === id);
      products[productIndex] = updateProduct;

      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    getProdcutsFromFile((products) => {
      const productIndex = products.findIndex((p) => p.id === id);
      products.splice(productIndex, 1);

      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
};
