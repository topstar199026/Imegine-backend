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
const {ContactUtil, ValidationUtil, UserUtil, GroupUtil} = utils;

const opts = {};
opts.secretOrKey = Constant.secretOrKey;

const getContactList = async (req, res) => {
	let userData = req.body.values;
	
	const userList = await UserUtil.getUserBySimilarId(userData, req.user.userId);
	const contactList = await ContactUtil.getContactList(userData, req.user.id);
	const frequentlyContactList = contactList.rows;
	contactList.fRows = frequentlyContactList;
	contactList.uRows = userList;
	const _enc = await aesEncrypt0(JSON.stringify(contactList));
	const _key = await encrypt(_enc.key, userData.key);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}

const getContactList2 = async (req, res) => {
	let userData = req.body.values;
	
	const contactList = await ContactUtil.getContactList(userData, req.user.id);
	const _enc = await aesEncrypt0(JSON.stringify(contactList.rows));
	const _key = await encrypt(_enc.key, userData.key);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}

const getContactList3 = async (req, res) => {
	let userData = req.body.values;

	const userList = await UserUtil.getUserBySimilarId(userData, req.user.userId);
	const contactList = await ContactUtil.getContactList3(userData, req.user.id);
	const frequentlyContactList = contactList.rows;
	contactList.fRows = frequentlyContactList;
	contactList.uRows = userList;

	const _enc = await aesEncrypt0(JSON.stringify(contactList));
	const _key = await encrypt(_enc.key, userData.key);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}

const getContactList4 = async (req, res) => {
	let userData = req.body.values;

	const userList = await UserUtil.getUserBySimilarId(userData, req.user.userId);
	const contactList = await ContactUtil.getContactList4(userData, req.user.id);
	const frequentlyContactList = contactList;

	const data = {
		fRows: frequentlyContactList,
		uRows: userList,
		rows: contactList,
	}

	const _enc = await aesEncrypt0(JSON.stringify(data));
	const _key = await encrypt(_enc.key, userData.key);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}


const saveContact = async (req, res) => {
	console.log('---contact save request---');
	let userData = await rsaAesDecrypt(req.body.values);
	let validation = await ValidationUtil.saveContactValidation(userData);
	const contactUser1 = await UserUtil.getUserByUserId(userData.identigier);
	const contactUser2 = await ContactUtil.getContactByUserId(req.user.id, userData.identigier);
	console.log('------',  contactUser2.count)
	if(validation && contactUser1 && userData.identigier !== req.user.userId && contactUser2.count === 0) {
		const newData = await ContactUtil.saveContact(userData, req.user.id, contactUser1);
		res.json({ success : true, error: null, data: null, status : 200});
	}else{
		res.json({ 
			success : false, 
			error: 
				!(contactUser1) ?
				'Contact does not exist'
				:
				contactUser2.count > 0 ?
				'Contact already in contact list'
				:
				'Unknown error', 
			status : 200
		});
	}
}

const saveGroup = async (req, res) => {
	console.log('---group save request---');
	let userData = await rsaAesDecrypt(req.body.values);
	let validation = await ValidationUtil.saveGroupValidation(userData);
	if(validation) {
		const newData = await ContactUtil.saveGroup(userData, req.user.id, req.user.userId);
		res.json({ success : true, error: null, data: null, status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const getContactInfo = async (req, res) => {
	// console.log('---contact info get request---');
	const userData = await rsaAesDecrypt(req.body.values);
	const _public = req.body.values.public;
	console.log(_public, userData);

	const contactUser1 = await UserUtil.getUserByUserId(userData.contactId);
	const contactUser2 = await ContactUtil.getContactByUserId2(req.user.id, userData.contactId);

	let contactUser;
	if(contactUser2) {
		contactUser = contactUser2;
	}else if(contactUser1){
		contactUser = contactUser1;
	}

	if(contactUser) {
		const _enc = await aesEncrypt0(JSON.stringify(contactUser));
		const _key = await encrypt(_enc.key, _public);
		res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}

const getGroupContactInfo = async (req, res) => {
	// console.log('---group contact info get request---');
	const userData = await rsaAesDecrypt(req.body.values);
	// console.log('userData', userData);
	const _public = req.body.values.public;

	const groupInfo = await GroupUtil.getGroupIdById(userData.groupId);

	const arr = Object.values(groupInfo.member);
	const data = await UserUtil.getUserByUserIdArray(arr);

	// console.log(data)
	if(data) {
		const _enc = await aesEncrypt0(JSON.stringify(data));
		const _key = await encrypt(_enc.key, _public);
		res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
	}else{
		res.json({ success : false, error: Message.validation.RegisterUserValidation, status : 200});
	}
}


module.exports = {
	getContactList,
	getContactList2,
	getContactList3,
	getContactList4,
	saveContact,
	saveGroup,
	getContactInfo,
	getGroupContactInfo,
}

