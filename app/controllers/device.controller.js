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
const {ContactUtil, ValidationUtil, DeviceUtil, UserUtil} = utils;

const opts = {};
opts.secretOrKey = Constant.secretOrKey;

const linkDevice = async (req, res) => {
	console.log('---device link request---');
	let userData = await rsaAesDecrypt(req.body.values);
	console.log(userData, req.user);
	if(true) {
		const newData = await DeviceUtil.linkDevice(userData, req.user.id);
		res.json({ success : true, error: null, data: null, status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const unlinkDevice = async (req, res) => {
	console.log('---device unlink request---');
	let userData = await rsaAesDecrypt(req.body.values);
	console.log(userData, req.user);
	try {
		const newData = await DeviceUtil.unlinkDevice(userData, req.user.id);
		res.json({ success : true, error: null, data: null, status : 200});
	} catch (error) {
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const addDeviceCode = async (req, res) => {
	console.log('---device add request---', '+'+req.socket.remoteAddress+'+', req.body.values);
	let userData = await rsaAesDecrypt(req.body.values);
	userData.public = req.body.values.public;
	const device = await DeviceUtil.addDevice(userData.deviceCode, userData.public);
	res.json(device);
}

const enableDeviceStatus = async (req, res) => {
	try {
		console.log('---device enable status request---');
		let userData = await rsaAesDecrypt(req.body.values);
		const publicKey = req.body.values.public;
		console.log(userData);
		// userData.deviceCode = 'obsOZ9JlFCx2C6jHC8AQNySvCx7TU6rXG7Rlcfr4xruAVWlePMKDX3Hj4sQDzlO5qX4GqluEexUEInRAY8cgOOZX2WsM7MWgGQxl';
		const device = await DeviceUtil.getDeviceByAddress(userData.deviceCode);
		
		if(device && device.active === true) {
			const user = await UserUtil.getUserById(device.UserId);
			const _device = {
				UserId: device.UserId,
				active: device.active,
				address: device.address,
				deviceType: device.deviceType,
				deviceUserId: device.deviceUserId,
				id: device.id,
				public: device.public,
				nickName: user.nickName,
				avatar: user.avatar,
			}

			const payload = {
				id: device.UserId,
				deviceId: device.id,
				userId: device.deviceUserId,
				type: 'web',
			};

			console.log('payload', payload, _device)
			const token = jwt.sign(payload, opts.secretOrKey);
			const _enc = await aesEncrypt0(JSON.stringify(_device));
			const _key = await encrypt(_enc.key, publicKey);
			res.json({ success : true, token : token, data : {data: _enc.data, key: _key} ,status : 200});
		} else {
			res.json({ success : false, error: Message.validation.NoActiveDevice, status : 200});
		}		
	} catch (error) {
		console.log('error', error)
		res.json({ success : false, error: Message.validation.NoActiveDevice, status : 200});
	}	
}

const getDeviceStatus = async (req, res) => {
	console.log('---device status request---', req.user);
	const deviceData = await DeviceUtil.getDevice(req.user.id);

	console.log(deviceData)

	const _enc = await aesEncrypt0(JSON.stringify(deviceData.devices));
	const _key = await encrypt(_enc.key, deviceData.device.public);

	if(true) {
		res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

module.exports = {
	linkDevice,
	unlinkDevice,
	addDeviceCode,
	enableDeviceStatus,
	getDeviceStatus,
}

