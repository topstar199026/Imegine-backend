const express = require('express');
const deviceCtrl = require('../app/controllers/device.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/device/linkDevice')
  .post(auth, deviceCtrl.linkDevice)  

router.route('/device/unlinkDevice')
  .post(auth, deviceCtrl.unlinkDevice) 

router.route('/device/addDeviceCode')
  .post(deviceCtrl.addDeviceCode)
  
router.route('/device/enableDeviceStatus')
  .post(deviceCtrl.enableDeviceStatus)

router.route('/device/getDeviceStatus')
  .post(auth, deviceCtrl.getDeviceStatus)
  
module.exports = router ;


