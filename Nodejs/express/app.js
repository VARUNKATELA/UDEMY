// // const dotenv = require('dotenv').config();
// const path = require('path');
// const bodyParser = require('body-parser');
// const express = require('express');

// const errorController = require('./controllers/error404')
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// })

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// app.use('/', errorController.error404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(result => {
//     return User.findByPk(1);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Varun', email: 'varun2004' });
//     }
//     return user;
//   })
//   .then(user => {
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(3110, () => {
//       console.log('Server Connected !!');
//     });
//   })
//   .catch(err => console.log(err))

// For Mongodb //

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error404')
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://varunkatela04:SAewPoVIKmdP9h8D@cluster0.neztzea.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.error404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server Connected!!!')
    })
  })
  .catch(err => console.log(err));