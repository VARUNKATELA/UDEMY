const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.product_name;
  const description = req.body.description;
  const price = req.body.price;
  const saler = req.body.sold_by;
  const product = new Product({
    title: title,
    description: description,
    price: price,
    saler: saler,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log('Product is Created');
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedtitle = req.body.product_name;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const updatedSaler = req.body.sold_by;

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedtitle;
      product.description = updatedDescription;
      product.price = updatedPrice;
      product.saler = updatedSaler;
      return product.save()
        .then(result => {
          console.log('Product Updated!!')
          res.redirect('/admin/products');
        })
    }).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        path: '/admin/products',
        pageTitle: 'Admin Products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};