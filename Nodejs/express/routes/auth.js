const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid Email')
      .custom((value, { req }) => {
        if (value === 'varunkatela04@gmail.com') {
          throw new Error('This Email is Already Exists.');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be more than 5 characters and must be only numbers and characters')
      .isAlphanumeric(),
    body('confirmPassword').custom((value, {req}) => {
      if(value !== req.body.password) {
        throw new Error('Confirm Password is not matched with Password');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;