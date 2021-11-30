const utils = require('../modules');

const {DeviceUtil, ValidationUtil, ChatUtil, KeyUtil, DateUtil, EmailUtil, GroupUtil} = utils;

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
} = KeyUtil;

const {
    onlineCheckByUserId,
    onlineCheckByDeviceId,
    onlineCheckBySocketId,
} = ChatUtil;

const {
    getNow,
} = DateUtil;

module.exports = (io, socket, onlineClients, onlineUsers, addSocket) => {

    const getReceiverIdArray = (receiver) => {
        const temp = [];
        for(var i=0; i<receiver.length; i++) {
            temp.push(receiver[i].contactId);
        }
        return temp;
    }

    const sendGroupEmailAction = async (data, currentDate, newEmail, userId) => {

        let dataDec = data.dataDec;
        let dataEnc = data.dataEnc;

        const members = getReceiverIdArray(dataDec.receiver);
		members.push(userId);
			
        const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(members);

		for(var i=0; i<devices.length; i++) {
            var _device = devices[i];      
            var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id); 

            const _key = await encrypt(data.key, _device.public); 
            if(socketId) {
                io.to(socketId).emit('message:group:receive', {messageId: newEmail.id, data: data.dataEnc, key: _key, date: currentDate});
            } else {
                await EmailUtil.savePending(_device, newEmail, _key);
            }
        }
    }

    const sendEmail = (payload) => {
        console.log('send email request')
        const data = payload.data;
        const _now = payload.currentDate;
        const newEmail = payload.newEmail;
        const userId= payload.userId;
        sendGroupEmailAction(data, _now, newEmail, userId);
    }

    const sendPlanner = async (payload) => {
        console.log('send planner request')
        const userId = payload.userId;
        const devices = await DeviceUtil.getDeviceByDeviceUserIdArray([userId]);

		for(var i=0; i<devices.length; i++) {
            var _device = devices[i];      
            var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id); 
            if(socketId) {
                io.to(socketId).emit('planner:send');
            }
        }
    }
  
    socket.on("email:send", sendEmail);
    socket.on("planner:send", sendPlanner);
}