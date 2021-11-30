const express = require('express');
const userCtrl = require('../app/controllers/user.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/user/publicKey')
  .post(userCtrl.publicKey)
router.route('/user/testPublicKey')
  .post(userCtrl.testPublicKey)

router.route('/user/testClientPublicKey')
  .post(userCtrl.testClientPublicKey)
  
router.route('/user/loginUser')
  .post(userCtrl.loginUser)

router.route('/user/registerUser')
  .post(userCtrl.registerUser)

router.route('/user/uploadImage')
  .post(userCtrl.uploadImage)
  
module.exports = router ;


