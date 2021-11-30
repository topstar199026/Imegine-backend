const express = require('express');
const messageCtrl = require('../app/controllers/message.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/message/getGroupId')
  .post(auth, messageCtrl.getGroupId)  

router.route('/message/getGroupIdList')
  .post(auth, messageCtrl.getGroupIdList)  
  
module.exports = router ;


