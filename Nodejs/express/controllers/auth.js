const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('Error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('Error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/sign-up', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: '' }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('Error', 'Invalid Email');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => res.redirect('/'));
          }
          req.flash('Error', 'Invalid Password');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err))
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/sign-up', {
      path: '/signup',
      pageTitle: 'Sign Up',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password, confirmPassword: confirmPassword }
    });
  }

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('Error', 'Email already exists \n Use Another Email for Sign Up!!');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'varunJain3104@gmail.com',
            subject: 'Signup Succeded',
            html: '<h1>You Signed up Succesfully</h1>'
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
};

exports.getReset = (req, res, next) => {
  let message = req.flash('Error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        req.flash('Error', 'Can\'t find email');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'varunJain3104@gmail.com',
          subject: 'Password Reset',
          html: `
          <p>You Requested a Password Reset</p>
          <p>Click This 
            <a href="https://localhost:3000/reset/${token}">link</a>
          to set a new Password</p>
          `
        });
      })
      .catch(err => console.log(err));
  });
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('Error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => consoleo.log(err));
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
}