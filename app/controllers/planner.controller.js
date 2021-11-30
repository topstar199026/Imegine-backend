const fs = require('fs');
var { Op } = require('sequelize');
const securePassword = require('secure-password');
const moment = require('moment');
const { randomBytes } = require('crypto');
const jwt  = require('jsonwebtoken');

const models = require('../../models');
const utils = require('../modules');
const constants = require('../../constants');
const passT = securePassword();
const {
	generateServerKey,
    getServerPublicKey,
    getServerPrivateKey,
    serverDecrypt,
    serverEncrypt,
    encrypt,
    aesEncrypt0,
    aesDecrypt0,
    aesEncrypt1,
    aesDecrypt1,
    objectEncrypt,
    objectDecrypt,
	rsaAesDecrypt,
} = require('../modules/keyUtil');

const {Message, Constant} = constants;
const {ContactUtil, ValidationUtil, UserUtil, PlannerUtil, DeviceUtil, ServerUtil} = utils;

const opts = {};
opts.secretOrKey = Constant.secretOrKey;

const savePlanner = async (req, res) => {
	console.log('---planner save request---');
	let userData = await rsaAesDecrypt(req.body.values);

	console.log('userData', userData);
	let validation = await ValidationUtil.savePlannerValidation(userData);
	// const contactUser1 = await UserUtil.getUserByUserId(userData.identigier);
	// const contactUser2 = await ContactUtil.getContactByUserId(req.user.id, userData.identigier);
	// console.log('------',  contactUser2.count)
	if(validation) {
		const newData = await PlannerUtil.savePlanner(userData, req.user.id);
		ServerUtil.plannerNotification(req.user.userId);
		res.json({ success : true, error: null, data: null, status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const getPlanner = async (req, res) => {
	console.log('---planner save request---');
	let userData = await rsaAesDecrypt(req.body.values);
	console.log('userData', userData);
	if(true) {
		const newData = await PlannerUtil.getPlanner(userData, req.user.id);
		const deviceInfo = await DeviceUtil.getDeviceByDeviceId(req.user.deviceId);

		const _enc = await aesEncrypt0(JSON.stringify(newData));
		const _key = await encrypt(_enc.key, deviceInfo.public);
		res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

module.exports = {
	savePlanner,
	getPlanner,
}

