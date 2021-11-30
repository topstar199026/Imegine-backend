const express = require('express');
const plannerCtrl = require('../app/controllers/planner.controller');

const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

const router = express.Router()

router.route('/planner/savePlanner')
  .post(auth, plannerCtrl.savePlanner)

router.route('/planner/getPlanner')
  .post(auth, plannerCtrl.getPlanner)
  
  
module.exports = router ;


