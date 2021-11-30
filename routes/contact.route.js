const express = require('express');
const contactCtrl = require('../app/controllers/contact.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/user/saveContact')
  .post(auth, contactCtrl.saveContact)
  
router.route('/user/saveGroup')
  .post(auth, contactCtrl.saveGroup)

router.route('/user/getContactList')
  .post(auth, contactCtrl.getContactList)

router.route('/user/getContactList2')
  .post(auth, contactCtrl.getContactList2)

router.route('/user/getContactList3')
  .post(auth, contactCtrl.getContactList3)

router.route('/user/getContactList4')
  .post(auth, contactCtrl.getContactList4)

router.route('/user/getContactInfo')
  .post(auth, contactCtrl.getContactInfo)

router.route('/user/getGroupContactInfo')
  .post(auth, contactCtrl.getGroupContactInfo)
  

module.exports = router ;


