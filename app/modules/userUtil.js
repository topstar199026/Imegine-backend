var { Op } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {User, Key} = models;

const getUserById = async (id) => {
    return await User.findOne(
        {
            raw: true,
            where: {
                id: id
            },
            attributes: [
                'id',
                'userId',
                'countryId',
                'nickName',
                'password',
                'avatar',
            ],
        }
    );
}

const getUserBySimilarId = async (userData, userId) => {
    
    return userData.searchString.length < 3 ? [] : await User.findAll(
        {
            raw: true,
            where: {               
                userId: {
                    [Op.substring]: userData.searchString,
                    [Op.ne]: userId,
                },
            },
            order: [
                'userId',
            ],
            attributes: [
                'id',
                'userId',
                'countryId',
                'nickName',
                'avatar',
            ],
        }
    );
}

const getUserByUserId = async (userId) => {
    return await User.findOne(
        {
            raw: true,
            where: {
                userId: userId
            },
            attributes: [
                'id',
                'userId',
                'countryId',
                'nickName',
                'password',
                'avatar',
                'firstName',
                'lastName',
                'jobTitle',
                'nickName',
                'address',
            ],
        }
    );
}

const createUser = async (userData) => {
    const user = new User();
    user.userId = userData.userId;
    user.password = userData.password;
    user.countryId = userData.countryId;   
    user.nickName = userData.nickName;
    user.avatar = userData.imagePath;
    await user.save();

    return user;
}

const getUserByUserIdArray = async (userIdArr) => {
    return await User.findAll(
        {
            raw: true,
            where: {
                userId: {
                    [Op.in]: userIdArr
                },
            },
            attributes: [
                'id',
                'userId',
                'countryId',
                'nickName',
                'avatar',
            ],
        }
    );
}


module.exports = {
    getUserById,
    getUserBySimilarId,
	getUserByUserId,
    createUser,
    getUserByUserIdArray,
}