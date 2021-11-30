const models = require('../models');
const constants = require('../config/constant');
var _log = constants._log;
var moment = require('moment');
var { Op } = require('sequelize');

const {User,Profile,Url} = models;

var mail_api_key = constants.mail_api_key;
var mail_domain = constants.mail_domain;
var mailgun = require('mailgun-js')({apiKey: mail_api_key, domain: mail_domain});


const sendMessageUser = async (user_id,message_type) => {
	let _user = await User.findOne(
		{ 
			where: { id : user_id } ,
			include: [{
				model: Profile
			}]
		}
	);
	let user = _user.dataValues;_log && console.log('re',user);
	let data ;
	switch (message_type) {
		case 0 :			
			data = {
				
			};
			break;
		case 1 :
			data = {
				
			};
			break;
		case 2 :
			template = '';
			break;
	}
	
	mailgun.messages().send(data, function (error, body) {
		_log && console.log(body);
	});
};

const sendMessageData = async (user_id, _data, message_type,previous_price,desired_price) => {
	_log && console.log('_data',_data);
	let _user = await User.findOne(
		{ 
			where: { id : user_id }  ,
			include: [{
				model: Profile
			}]
		}
	);

	let user = _user.dataValues;_log && console.log('re',user);
	let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
	var percents = Math.round((_data.current_price-desired_price)/_data.current_price*100,1);
	let data = {
		
	};
	
	mailgun.messages().send(data, function (error, body) {
		_log && console.log(body);
	});
};

const sendMessageForgot = async (user_id, message_type) => {
	let _user = await User.findOne(
		{ 
			where: { id : user_id } ,
			include: [{
				model: Profile
			}]
		}
	);
	let user = _user.dataValues;
	let data = {
		
	};
	
	mailgun.messages().send(data, function (error, body) {
		_log && console.log(body);
	});
};

const sendMessageReset = async (user_id, message_type) => {
	let _user = await User.findOne(
		{ 
			where: { id : user_id } ,
			include: [{
				model: Profile
			}]
		}
	);
	let user = _user.dataValues;
	let data = {
		
	};
	
	mailgun.messages().send(data, function (error, body) {
		_log && console.log(body);
	});
};

module.exports = {
    sendMessageUser,
	sendMessageData,
	sendMessageForgot,
	sendMessageReset
}