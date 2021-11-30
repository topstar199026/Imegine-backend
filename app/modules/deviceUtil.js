var { Op } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {User, Key, Device} = models;

const {
	getUserById
} = require('../modules/userUtil');

const getDeviceByDeviceId = async (deviceId) => {
    return await Device.findOne(
        {
            raw: true,
            where: {
                id: deviceId,
                active: true,
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const getDeviceByUserPrimaryId = async (userId) => {
    return await Device.findAll(
        {
            raw: true,
            where: {
                UserId: userId,
                active: true,
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const getMobileDeviceByUserId = async (userId) => {
    return await Device.findOne(
        {
            raw: true,
            where: {
                UserId: userId,
                deviceType: 'mobile',
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const getDeviceByDeviceUserIdArray = async (userIdArr) => {
    return await Device.findAll(
        {
            raw: true,
            where: {
                deviceUserId: {
                    [Op.in]: userIdArr
                },
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const getDeviceByDeviceUserIdArrayWithNotCurrentUser = async (userIdArr) => {
    return await Device.findAll(
        {
            raw: true,
            where: {
                deviceUserId: {
                    [Op.in]: userIdArr
                },
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const getDeviceByAddress = async (address) => {
    return await Device.findOne(
        {
            raw: true,
            where: {
                address: address
            },
            attributes: [
                'id',
                'nickName',
                'address',
                'active',
                'deviceUserId',
                'UserId',
                'public',
                'deviceType'
            ],
        }
    );
}

const addMobileDevice = async (userData, public) => {
    const device = new Device();
    device.nickName = 'Mobile-' + userData.userId;
    device.address = 'Address-' + userData.userId;
    device.deviceUserId = userData.userId;
    device.UserId = userData.id;    
    device.deviceType = 'mobile';
    device.active = true;
    device.public = public;
    await device.save();
    
    return device;
}

const addDevice = async (address, public) => {
    const device = new Device();
    device.address = address;
    device.public = public;
    device.deviceType = 'web';
    await device.save();    
    return device;
}

const linkDevice = async (userData,userId) => {
    const address = userData.deviceId;//'T5DslutdEX5RjqhjVWpFPdE8o6IQEf43IKXUmie3kq4xy8lgliIUqhDiUSTQFiMJLFc4FHPLThEDKAQEUu0qPhVAkaXuvbSp7R7Z';//userData.address;
    const user = await getUserById(userId);
    const device = await Device.findOne(
        {
            where: {
                address: address
            },
        }
    );
    if(device) {
        device.UserId = userId;
        device.deviceUserId = user.userId;
        device.active = true;
        await device.save();
    }
    return device;
}

const unlinkDevice = async (userData,userId) => {
    await Device.destroy(
        {
            where: {
                UserId: userId,
                id: {
                    [Op.in]: userData.deviceList
                },
            },
        }
    );

}

const getDevice = async (userId) => {
    const user = await getUserById(userId);

    const device = await Device.findOne(
        {
            raw: true,
            where: {
                UserId: userId,
                deviceType: 'mobile',
            },
        }
    );

    const devices = await Device.findAll(
        {
            raw: true,
            where: {
                UserId: userId,
                deviceType: 'web',
            },
        }
    );
    return {
        device: device,
        devices: devices,
    };
}

module.exports = {
    getDeviceByDeviceId,
	getDeviceByUserPrimaryId,
    getDeviceByAddress,
    getMobileDeviceByUserId,
    getDeviceByDeviceUserIdArray,
    addMobileDevice,
    addDevice,
    linkDevice,
    unlinkDevice,
    getDevice,
}