const express = require('express');
const emailCtrl = require('../app/controllers/email.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/email/saveEmail')
  .post(auth, emailCtrl.saveEmail)  

  router.route('/email/uploadFile')
  .post(auth, emailCtrl.uploadFile)

module.exports = router ;


