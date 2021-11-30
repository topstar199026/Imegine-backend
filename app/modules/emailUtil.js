var { Op, NOW, Sequelize } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {Contact, Group, GroupDetail, Message, MessagePending} = models;

const UserUtil = require('./userUtil');


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

const saveEncryptEmail = async (dataDec, dataEnc, now) => {
    try {
        const newMessage = new Message();
        newMessage.senderId = dataDec.sender.id;
        newMessage.receiverId = dataDec.group.id;
        newMessage.message = dataEnc;
        newMessage.messageType = 5;// dataDec.messageType;
        newMessage.editAt = now;
        await newMessage.save();
        return _chatItem2(newMessage);
    } catch (error) {
        console.log(error)
    }
}

const savePending = async (device, newEmail, key) => {
    try {
        const newPending = new MessagePending();
        newPending.DeviceId = device.id;
        newPending.MessageId = newEmail.id;
        newPending.key = key;
        await newPending.save();        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    saveEncryptEmail,
    savePending,
};