const fs = require('fs');
var { Op } = require('sequelize');
const securePassword = require('secure-password');
const moment = require('moment');
const { randomBytes } = require('crypto');
const formidable = require('formidable');
const jwt  = require('jsonwebtoken');
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

const fileHandler = require('./file.controller');

const {Message, Constant} = constants;
const {UserUtil, ValidationUtil, DeviceUtil} = utils;

const opts = {};
opts.secretOrKey = Constant.secretOrKey;

function randomInt() {
  	return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

/*-- Main Code --*/
const publicKey = async (req, res) => {  
	const publicKey = getServerPublicKey();
	res.json(publicKey.toString('utf8'));
};

const testPublicKey = async (req, res) => {  
	const {message} = req.body.values;
	serverDecrypt(message);
	res.json();
};

const testClientPublicKey = async (req, res) => {  
	const {key} = req.body.values;
	console.log('user public key', key)
	const result = encrypt('Test ABABABABABABAsdf sdf !@# df SD $#@r sD@$# ', key);
	res.json(result);

};


const loginUser = async (req, res) => {
	console.log('---user login request---');
	let userData = objectDecrypt(req.body.values, getServerPrivateKey());
	const existingUser = await UserUtil.getUserByUserId(userData.userId);
	if (existingUser) {
		const passwordBuf = Buffer.from(userData.password);
		const hashBuf = Buffer.from(existingUser.password, 'base64');
		const pwdResponse = passT.verifySync(passwordBuf, hashBuf);

		if (pwdResponse === securePassword.VALID) {			
			delete existingUser.password;
			const mobileDevice = await DeviceUtil.getMobileDeviceByUserId(existingUser.id);
			existingUser['deviceId'] = mobileDevice.id;

			const payload = {
				id: existingUser.id,
				deviceId: mobileDevice.id,
				userId: mobileDevice.deviceUserId,
				type: 'mobile',
			};

			const token = jwt.sign(payload, opts.secretOrKey);
			const _enc = await aesEncrypt0(JSON.stringify(existingUser));
			const _key = await encrypt(_enc.key, userData.key);
			res.json({ success : true, token : token, data : {data: _enc.data, key: _key} ,status : 200});
		} else {
			res.json({ success : false, error: Message.validation.PasswordInvalid, status : 200});
		}
		
	} else {
		res.json({ success : false, error: Message.validation.NoExistedUser, status : 200});
		// let validation = await ValidationUtil.registerUserValidation(userData);
		// if(validation) {			
		// 	const newUser = await UserUtil.createUser(userData);
		// 	res.json({ success : true, error: null, data: newUser, status : 200});
		// }else{
		// 	res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
		// }		
	}

	res.json();
}

const registerUser = async (req, res) => {
	console.log('---user register request---', req.body.values);
	let userData = objectDecrypt(req.body.values, getServerPrivateKey());
	const existingUserId = await UserUtil.getUserByUserId(userData.userId);
	if (existingUserId) {
		res.json({ success : false, error: Message.validation.ExistedUserId, status : 200});
	} else {
		let validation = await ValidationUtil.registerUserValidation(userData);
		if(validation) {	
			const hashedPw = passT.hashSync(Buffer.from(userData.password)).toString('base64');	
			userData.password = hashedPw;	
			const newUser = await UserUtil.createUser(userData);
			const newDevice = await DeviceUtil.addMobileDevice(newUser, userData.key);
			res.json({ success : true, error: null, data: null, status : 200});
		}else{
			res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
		}		
	}
}

const uploadImage = async (req, res) => {
	console.log('---user image upload request---');
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			return res.json({
				error: 'Image could not be uploaded'
			})
		}else{
			if (files.photo) {
				console.log('files', files)
				var imageName = await fileHandler.uploadFileToS3({type : 1, files: files});
				console.log('imageName imageName', imageName)
				
				if(imageName) {
					res.json({ success : true, message: 'success', imageName : imageName, status : 200});
				} else {
					res.json({ success : false, message: 'fail', status : 200});
				}
			}else{
				res.json({ success : false, message: 'fail', status : 200});
			}
		}
	});
}









module.exports = {
  	publicKey,
	testPublicKey,
	testClientPublicKey,
	loginUser,
	registerUser,
	uploadImage,
}

