var { Op, NOW, Sequelize } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {Contact, Group, GroupDetail, MessageRead, Message, MessagePending, ReadPending} = models;

const UserUtil = require('./userUtil');


const onlineCheckByUserId = (onlineUsers, userId) => {
    return onlineUsers.get(userId)
}

const onlineCheckByDeviceId = (onlineUsers, userId, deviceId) => {
    var _user = onlineUsers.get(userId);
    if(_user && _user.length > 0) {
        for(var i = 0; i < _user.length; i++){
            var _device = _user[i];
            if(deviceId === _device.deviceId){
                return _device.socketId;
            }
        }
        return null;
    } else 
        return null;
}

const onlineCheckBySocketId = (onlineClients, socketId) => {
    return onlineClients.get(socketId);        
}

const _chatItem = (data) => {
    return {
        id: data.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        messageType: data.messageType,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        readAt: data.readAt,
        deletedAt: data.deletedAt,
    }
}

const _chatItem2 = (data) => {
    return {
        id: data.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        messageType: data.messageType,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        readAt: data.readAt,
        deletedAt: data.deletedAt,
    }
}

const newChat = async (data) => {
    try {
        const newMessage = new Message();
        // const receiver = await UserUtil.getUserByUserId(data.receiver.contactId);
        // newMessage.senderId = data.sender.id;
        // newMessage.receiverId = data.receiver.id;
        // newMessage.message = data.message;
        // newMessage.messageType = data.messageType;
        await newMessage.save();
        return _chatItem(newMessage);
    } catch (error) {
        
    }
}

const saveChat = async (data) => {
    try {
        const newMessage = new Message();
        // const receiver = await UserUtil.getUserByUserId(data.receiver.contactId);
        newMessage.senderId = data.sender.id;
        newMessage.receiverId = data.receiver.id;
        newMessage.message = data.message;
        newMessage.messageType = data.messageType;
        await newMessage.save();
        return _chatItem(newMessage);
    } catch (error) {
        
    }
}

const saveEncryptChat = async (dataDec, dataEnc, now) => {
    try {
        const newMessage = new Message();
        newMessage.senderId = dataDec.sender.id;
        newMessage.receiverId = dataDec.receiver.id;
        newMessage.message = dataEnc;
        newMessage.messageType = dataDec.messageType;
        newMessage.editAt = now;
        await newMessage.save();
        return _chatItem(newMessage);
    } catch (error) {
        console.log(error)
    }
}

const saveEncryptGroupChat = async (dataDec, dataEnc, now) => {
    try {
        const newMessage = new Message();
        newMessage.senderId = dataDec.sender.id;
        newMessage.receiverId = dataDec.group.id;
        newMessage.message = dataEnc;
        newMessage.messageType = dataDec.messageType;
        newMessage.editAt = now;
        await newMessage.save();
        return _chatItem2(newMessage);
    } catch (error) {
        console.log(error)
    }
}

const savePending = async (device, newMessage, key) => {
    try {
        const newPending = new MessagePending();
        newPending.DeviceId = device.id;
        newPending.MessageId = newMessage.id;
        newPending.key = key;
        await newPending.save();        
    } catch (error) {
        console.log(error)
    }
}

const saveReadStatePending = async (device, readMessageList) => {
    try {
        readMessageList.map(async function(mId) {
            const newReadPending = new ReadPending();
            newReadPending.DeviceId = device.id;
            newReadPending.messageReadId = mId;
            await newReadPending.save();     
        })
           
    } catch (error) {
        console.log(error)
    }
}

const readChat = async (userData) => {
    try {
        Message.update({
                readAt: NOW(),
            },{
            where: {
                receiverId: userData.sender.id,
                senderId: userData.receiver.id,
                readAt: {
                    [Op.eq]: null
                }
            }            
        }).then(res => {
            console.log('-----------', res)
        }).catch(err => {
            console.log(err)

        })
    } catch (err) {
        console.log(err)
    }
    
    
}

const getMessageReadStateByUserIdAndMessageId = async (messageId, userId, groupUserId, groupId, now) => {
    var rItem =  await MessageRead.findOne(
        {
            raw: true,
            where: {
                messageId: messageId,
                groupUserId: groupUserId,
            },
        }
    );
    if(rItem) {
        return null;
    } else {
        const newMessageRead = new MessageRead();
        newMessageRead.userId = userId;
        newMessageRead.groupUserId = groupUserId;
        newMessageRead.groupId = groupId;
        newMessageRead.messageId = messageId;
        newMessageRead.readAt = now;
        newMessageRead.active = true;
        await newMessageRead.save();  
        return  newMessageRead.id;
    }
}

const saveMessageReadState = async (data, now) => {
    const newMessageRead = new MessageRead();
    newGroupState.userId = data.sender.userId;
    newGroupState.groupUserId = data.sender.id;
    newGroupState.GroupId = data.group.id;
    newGroupState.messageId = data.messageId;
    newGroupState.readAt = now;
    newGroupState.active = true;
    await newGroupState.save();   
}

const updateGroupState = async (id, data, now) => {
    // await GroupState.update({
    //         messageId: data.messageId,
    //         readAt: now,
    //     },{
    //     where: {
    //         id: id
    //     }            
    // }).then(res => {
    //     console.log('-----------', res)
    // }).catch(err => {
    //     console.log(err)

    // }) 
}

const saveEncryptReadChat = async (dataDec, dataEnc, now) => {
    
    try {
        let data = dataDec;

        let rItemTemp = [];
        for(var i=0; i<data.messageList.length; i++) {
            let mItem = data.messageList[i];
            let rItem = await getMessageReadStateByUserIdAndMessageId(mItem.messageId, data.sender.userId, data.sender.id, data.group.id, now);
            rItem && rItemTemp.push(rItem);
        }
        return rItemTemp;
        
    } catch (err) {
        console.log(err);
        return [];
    }    
}


const loadChat = async (userData) => {
    const data =  await Message.findAndCountAll(
        {
            raw: true,
            where: {               
                [Op.or]: [
                    {
                        senderId: userData.sender.id,
                        receiverId: userData.receiver.id,
                    },
                    {
                        senderId: userData.receiver.id,
                        receiverId: userData.sender.id,
                    },
                ],
            },
            order: [
                'created_at',
            ],
            attributes: [
                'id',
                'senderId',
                'receiverId',
                'message',
                'messageType',
                'updated_at',
            ],
        }
    );

    return data;
    
}

const loadPendingList = async (userData) => {
    console.log('pending load request', userData);
    const data =  await Message.findAll(
        {
            raw: true,
            where: {               
                '$MessagePendings.device_id$': userData.deviceId,
            },
            include: [
                {
                    model: MessagePending,
                    as: 'MessagePendings',
                    required: false,
                    attributes: [
                        'id',
                        'key',
                    ],
                }
            ],
            order: [
                'created_at',
            ],
            attributes: [
                'id',
                'senderId',
                'receiverId',
                'message',
                'messageType',
                'editAt',
                'updated_at',
            ],
        }
    );

    await MessagePending.destroy({
        where: {               
            'device_id': userData.deviceId,
        },
    })

    return data;

}

const loadPendingReadList = async (userData) => {
    console.log('pending load request', userData);
    const data =  await MessageRead.findAll(
        {
            raw: true,
            where: {               
                '$ReadPendings.device_id$': userData.deviceId,
            },
            include: [
                {
                    model: ReadPending,
                    as: 'ReadPendings',
                    required: false,
                    attributes: [
                        'id',
                    ],
                }
            ],
            order: [
                'created_at',
            ],
            // attributes: [
            //     'id',
            //     'senderId',
            //     'receiverId',
            //     'message',
            //     'messageType',
            //     'editAt',
            //     'updated_at',
            // ],
        }
    );

    await ReadPending.destroy({
        where: {               
            'device_id': userData.deviceId,
        },
    })

    return data;

}

module.exports = {
    onlineCheckByUserId,
    onlineCheckBySocketId,
    onlineCheckByDeviceId,
    newChat,
    saveChat,
    saveEncryptChat,
    saveEncryptGroupChat,
    savePending,
    saveReadStatePending,
    readChat,
    saveEncryptReadChat,
    loadChat,
    loadPendingList,
    loadPendingReadList,
};