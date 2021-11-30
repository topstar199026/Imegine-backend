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

const getGroupId = async (req, res) => {
	console.log('---get group id request---');
	let userData = await rsaAesDecrypt(req.body.values);
	console.log(userData, req.user)

    let isGroupSearch = userData.groupId ? true : false;

    let groupInfo;

    if(isGroupSearch) {
        groupInfo = await GroupUtil.getGroupIdById(userData.groupId);
    }else{
        groupInfo = await GroupUtil.getGroupId(userData);
    };

	console.log('groupId', groupInfo)

	const _enc = await aesEncrypt0(JSON.stringify(groupInfo));
	const _key = await encrypt(_enc.key, req.body.values.public);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}

const getReceiverIdArray = (receiver) => {
	const temp = [];
	for(var i=0; i<receiver.length; i++) {
		temp.push(receiver[i].contactId);
	}
	return temp;
}

const getGroupIdList = async (req, res) => {
	console.log('---get group id list request---');
	let userData = await rsaAesDecrypt(req.body.values);
	console.log(userData, req.user)

    const members = getReceiverIdArray(userData);
    const meId = req.user.userId;
    let groupList = await Promise.all(members.map(async (mId, index) => {
        const data = {
            sender: {
                userId: meId,
            },
            receiver: {
                contactId: mId,
            },
            groupId: null,
            private: true,
        };
        let gData = await GroupUtil.getGroupId(data);
        return gData;
    }));
    
	const _enc = await aesEncrypt0(JSON.stringify(groupList));
	const _key = await encrypt(_enc.key, req.body.values.public);
	res.json({ success : true, data : {data: _enc.data, key: _key} ,status : 200});
}

module.exports = {
	getGroupId,
    getGroupIdList,
}

