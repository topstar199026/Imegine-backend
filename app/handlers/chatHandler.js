const utils = require('../modules');

const {DeviceUtil, ValidationUtil, ChatUtil, KeyUtil, DateUtil, GroupUtil} = utils;

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
    const sendMessageAction = async (id, userId, data, currentDate, newMessage) => {    
        const userDevices = await DeviceUtil.getDeviceByUserPrimaryId(id);
        for(var i=0; i<userDevices.length; i++) {
            var _device = userDevices[i];   
            var socketId = onlineCheckByDeviceId(onlineUsers, userId, _device.id);    
            const _key = await encrypt(data.key, _device.public);   
            if(socketId) {
                io.to(socketId).emit('message:receive', {messageId: newMessage.id, data: data.dataEnc, key: _key, date: currentDate});
            } else {
                await ChatUtil.savePending(_device, newMessage, _key);
            }
        }
    }

    const sendGroupMessageAction = async (data, currentDate, newMessage) => {
        let groupId = newMessage.receiverId;
        let groupInfo = await GroupUtil.getGroupIdById(groupId);
        // console.log('group info', groupInfo);

        const members = Object.values(groupInfo.member);
        const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(members);
        console.log('member devices', devices);

        // const userDevices = await DeviceUtil.getDeviceByUserPrimaryId(id);
        for(var i=0; i<devices.length; i++) {
            var _device = devices[i];   
            var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id);    
            const _key = await encrypt(data.key, _device.public);   
            if(socketId) {
                io.to(socketId).emit('message:group:receive', {messageId: newMessage.id, data: data.dataEnc, key: _key, date: currentDate});
            } else {
                ChatUtil.savePending(_device, newMessage, _key);
            }
        }
    }

    const sendReadAction = async (data, currentDate) => {    
        let groupId = data.dataDec.group.id;
        let groupInfo = await GroupUtil.getGroupIdById(groupId);
        // console.log('group info', groupInfo);

        const members = Object.values(groupInfo.member);
        const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(members);
        // console.log('read member devices', devices);

        for(var i=0; i<devices.length; i++) {
            var _device = devices[i];   
            var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id);    
            const _key = await encrypt(data.key, _device.public);   
            if(socketId) {
                io.to(socketId).emit('message:read:request', {data: data.dataEnc, key: _key, date: currentDate});
            } else {
                // ChatUtil.savePending(_device, newMessage, _key);
            }
        }

        // for(var i=0; i<userDevices.length; i++) {
        //     var _device = userDevices[i];   
        //     var socketId = onlineCheckByDeviceId(onlineUsers, userId, _device.id);    
        //     const _key = await encrypt(data.key, _device.public);   
        //     if(socketId) {
        //         io.to(socketId).emit('message:read:request', {data: data.dataEnc, key: _key, date: currentDate});
        //     } else {
        //         // await ChatUtil.savePending(_device, newMessage, _key);
        //     }
        // }
    }

    const sendReadAction2 = async (data, messageReadList, currentDate) => {    
        let groupId = data.dataDec.group.id;
        let groupInfo = await GroupUtil.getGroupIdById(groupId);
        console.log('group info', groupInfo);

        const members = Object.values(groupInfo.member);
        var members2 = [];
        for(var mI=0; mI<members.length; mI++) members[mI] !== data.dataDec.sender.userId && members2.push(members[mI]);
        
        const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(members2);
        console.log('read member devices -----------', members2, devices);

        for(var i=0; i<devices.length; i++) {
            var _device = devices[i];   
            var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id);    
            const _key = await encrypt(data.key, _device.public);   
            if(socketId) {
                io.to(socketId).emit('message:read:state:request', {data: data.dataEnc, key: _key, date: currentDate});
            } else {
                ChatUtil.saveReadStatePending(_device, messageReadList);
            }
        }
    }    
    
    const sendMessage = async (data) => {
        const newMessage = await ChatUtil.saveChat(data);
        var _online = onlineCheckByUserId(onlineUsers, data.receiver.contactId);
        if(_online) {
            io.to(_online.socketId).emit('message:receive', newMessage);            
        }
        io.to(socket.id).emit('message:receive', newMessage);
    }

    const sendMessage2 = async (data) => {
        const _now = await getNow();
        data = await rsaAesDecryptWithKey(data);
        console.log('send message request', data)
        let dataDec = data.dataDec;
        let dataEnc = data.dataEnc;
        // const newMessage = await ChatUtil.saveEncryptChat(dataDec, dataEnc, _now);
        // console.log('send message newMessage', newMessage)
        // sendMessageAction(dataDec.sender.id, dataDec.sender.userId, data, _now, newMessage);
        // sendMessageAction(dataDec.receiver.id, dataDec.receiver.contactId, data, _now, newMessage);
    }

    const sendMessage3 = async (data) => {
        const _now = await getNow();
        data = await rsaAesDecryptWithKey(data);
        console.log('send group message request', data)
        let dataDec = data.dataDec;
        let dataEnc = data.dataEnc;
        const newMessage = await ChatUtil.saveEncryptGroupChat(dataDec, dataEnc, _now);
        console.log('send message newMessage', newMessage)
        // sendMessageAction(dataDec.sender.id, dataDec.sender.userId, data, _now, newMessage);
        // sendMessageAction(dataDec.receiver.id, dataDec.receiver.contactId, data, _now, newMessage);
        sendGroupMessageAction(data, _now, newMessage);
    }

    const readMessage = async (data) => {
        const _now = await getNow();
        data = await rsaAesDecryptWithKey(data);
        // console.log('read request', data);
        let dataDec = data.dataDec;
        let dataEnc = data.dataEnc;
        // const newMessage = await ChatUtil.saveEncryptReadChat(dataDec, dataEnc, _now);
        // console.log('send message newMessage', newMessage)
        sendReadAction(data, _now);
    }

    const readMessage2 = async (data) => {
        console.log('read request----------');
        const _now = await getNow();
        data = await rsaAesDecryptWithKey(data);
        console.log('read request', data);
        let dataDec = data.dataDec;
        let dataEnc = data.dataEnc;
        const newMessageReadState = await ChatUtil.saveEncryptReadChat(dataDec, dataEnc, _now);
        console.log('send message newMessage', newMessageReadState)
        newMessageReadState.length > 0 && sendReadAction2(data, newMessageReadState, _now);
    }
    
    const loadMessage = async (data) => {
        console.log('load request', data);
        const messageHistory = await ChatUtil.loadChat(data);

        io.to(socket.id).emit('message:history', {
            data: data,
            history: messageHistory,
        });
    }

    const loadPendingList = async (data) => {
        addSocket(data, socket);

        const deviceInfo = await DeviceUtil.getDeviceByDeviceId(data.deviceId);
        
        const _pendingList = await ChatUtil.loadPendingList(data);
        const _pendingReadList = await ChatUtil.loadPendingReadList(data);

        const _enc = await aesEncrypt0(JSON.stringify(_pendingReadList));
        const _key = await encrypt(_enc.key, deviceInfo.public);
        
        console.log('_pendingReadList-----------------------------------------', data, _pendingReadList)

        const pendingList = _pendingList.map(item => {
            return { 
                messageId: item.id,
                data: item.message,
                date: item.editAt,
                key: item['MessagePendings.key'],
            };
        });

        io.to(socket.id).emit('message:pending:load', {
            data: pendingList,
            data2: {
                messagePendingList: pendingList,
                readPendingList: {data: _enc.data, key: _key},
            },
        });
    }

    const sendTypingStatus = async (data) => {
        console.log('typing', data);

        let groupId = data.group.id;

        if(groupId) {
            let groupInfo = await GroupUtil.getGroupIdById(groupId);
            const members = Object.values(groupInfo.member);

            let _t = [];
            for(var i=0; i<members.length; i++) {
                if(members[i] !== data.sender.userId) {
                    _t.push(members[i]);
                }
            }

            const devices = await DeviceUtil.getDeviceByDeviceUserIdArray(_t);
            for(var i=0; i<devices.length; i++) {
                var _device = devices[i];   
                var socketId = onlineCheckByDeviceId(onlineUsers, _device.deviceUserId, _device.id);  
                if(socketId) {
                    io.to(socketId).emit('message:typing:start', data);
                }
            }
        }
    }
    
    const readUser = (orderId, callback) => {
    }

    const typingUser = (payload) => {
        console.log('user:typing', payload)
        socket.broadcast.emit('user:typing', 'typing...');
    }
  
    socket.on('message:send', sendMessage2);
    socket.on('message:group:send', sendMessage3);
    
    socket.on('message:read:request', readMessage);
    socket.on('message:read:state:request', readMessage2);    
    // socket.on('message:read_at:request', readMessage);

    socket.on('message:load:request', loadMessage);
    socket.on('message:typing:start', sendTypingStatus);
    
    socket.on('socket:info', loadPendingList);
}