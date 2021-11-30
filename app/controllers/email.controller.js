const fs = require('fs');
var { Op } = require('sequelize');
const securePassword = require('secure-password');
const moment = require('moment');
const formidable = require('formidable');
const { randomBytes } = require('crypto');
const jwt  = require('jsonwebtoken');
const { io } = require("socket.io-client");

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
	rsaAesDecryptWithKey,
} = require('../modules/keyUtil');

const {Message, Constant} = constants;
const {EmailUtil, ValidationUtil, ChatUtil, KeyUtil, DateUtil, DeviceUtil, GroupUtil, ServerUtil} = utils;

const opts = {};
opts.secretOrKey = Constant.secretOrKey;

const fileHandler = require('./file.controller');

const {
    getNow,
} = DateUtil;

const getReceiverIdArray = (receiver) => {
	const temp = [];
	for(var i=0; i<receiver.length; i++) {
		temp.push(receiver[i].contactId);
	}
	return temp;
}

const saveEmail = async (req, res) => {
	console.log('---email save request---');

	
	const _now = await getNow();
	let userData = await rsaAesDecryptWithKey(req.body.values);
	let dataDec = userData.dataDec;
	let dataEnc = userData.dataEnc;
	let validation = await ValidationUtil.saveEmailValidation(dataDec);
	console.log(userData, validation)
	if(validation) {

		const newEmail = await EmailUtil.saveEncryptEmail(dataDec, dataEnc, _now);	
		ServerUtil.emailNotification(userData, _now, newEmail, req.user.userId);
		// const members = getReceiverIdArray(dataDec.receiver);
		// members.push(req.user.userId);
			
        // const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(members);

		// for(var i=0; i<devices.length; i++) {
        //     var _device = devices[i];      
        //     const _key = await encrypt(userData.key, _device.public);   
        //     await EmailUtil.savePending(_device, newEmail, _key);
        // }

		
		res.json({ success : true, error: null, data: null, status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const uploadFile = async (req, res) => {
	console.log('---user image upload request---');
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			res.json({ success : false, message: 'fail', status : 200});
		}else{
			const fileKeys = Object.keys(files);

			const resArr = [];
			for(let i=0; i<fileKeys.length; i++) {
				if (files[fileKeys[i]]) {
					// console.log('files----', files[fileKeys[i]]);
					const _file = files[fileKeys[i]];
					var imageName = await fileHandler.uploadEmailAttachFileToS3(_file);
					// console.log('imageName imageName', imageName)
					
					resArr.push(imageName);
					
				}else{
					res.json({ success : false, message: 'fail', status : 200});
				}
			}


			if(resArr.length > 0) {
				res.json({ success : true, message: 'success', imageName : resArr, status : 200});
			} else {
				res.json({ success : false, message: 'fail', status : 200});
			}
		}
	});
}

module.exports = {
	saveEmail,
	uploadFile,
}

