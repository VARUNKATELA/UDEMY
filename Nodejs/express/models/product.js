///////////////////////////////////////
//This code is used in file System //
/////////////////////////////////////

// const fs = require('fs');
// const path = require('path');

// const Cart = require('./cart');

// // const products = [];

// const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     }
//     else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// }

// module.exports = class Product {
//   constructor(id, p, d, pr, s) {
//     this.id = id;
//     this.productName = p;
//     this.description = d;
//     this.price = pr;
//     this.saler = s
//   }

//   save() {
//     getProductsFromFile(products => {
//       if (this.id) {
//         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//         const updatedProduct = [...products];
//         updatedProduct[existingProductIndex] = this;
//         fs.writeFileSync(p, JSON.stringify(updatedProduct), (err) => {
//           console.log(err);
//         });
//       } else {
//         this.id = Math.random().toString();
//         products.push(this);
//         fs.writeFileSync(p, JSON.stringify(products), (err) => {
//           console.log(err);
//         });
//       }
//     });
//   }

//   static deleteById(id) {
//     getProductsFromFile(products => {
//       const product = products.find(prod => prod.id === id);
//       const updatedProducts = products.filter(prod => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         if (!err) {
//           Cart.deleteProduct(id, product.price);
//         }
//       });
//     });
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static findById(id, cb) {
//     getProductsFromFile(products => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     });
//   }
// };


////////////////////////////////////////
// This code is used in SQL Database //
//////////////////////////////////////

// const Cart = require('./cart');
// const db = require('../util/database');

// module.exports = class Product {
//   constructor(id, p, d, pr, s) {
//     this.id = id;
//     this.productName = p;
//     this.description = d;
//     this.price = pr;
//     this.saler = s
//   }

//   save() {
//     return db.execute('INSERT INTO products (product_name, description, price, sold_by) VALUES (?, ?, ?, ?)',
//       [this.productName, this.description, this.price, this.saler]
//     );
//   }

//   static deleteById(id) {

//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM products WHERE products.productId = ?', [id]);
//   }

// };

//////////////////////////////////////////////
// This code is used in Sequelize Database //
////////////////////////////////////////////

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   productName: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   saler: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// module.exports = Product

///////////////////////////////////
// This code is used in Mongodb //
/////////////////////////////////

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, description, price, saler, id, userId) {
//     this.title = title;
//     this.description = description;
//     this.price = price;
//     this.saler = saler;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//     }
//     else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(res => {
//         // console.log(res);
//       })
//       .catch(err => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray().then(result => {
//       return result;
//     }).catch(err => console.log(err))
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then(product => {
//         // console.log(product);
//         return product;
//       })
//       .catch(err => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log('Product is Deleted');
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;

const mongoose = require('mongoose');
const { INTEGER } = require('sequelize');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  saler: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);