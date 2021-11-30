var { Op } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {Contact, Group, GroupDetail, ContactDetail, Planner} = models;

const GroupUtil = require('./groupUtil');
const UserUtil = require('./userUtil');
const DeviceUtil = require('./deviceUtil');

const savePlanner = async (userData, userId) => {
    var start = userData.startDate.split(' ');
    var end = userData.endDate ? userData.endDate.split(' ') : null;

    const planner = new Planner();
    planner.title = userData.title;
    planner.startDate = start[0];
    planner.startTime = start[1] + ':00';
    planner.endDate = end ? end[0] : null;
    planner.endTime = end ? end[1] + ':00' : null;
    planner.reminderDate = userData.reminderDate;
    planner.reminderTime = start[1] + ':00';
    planner.officeFlag = userData.officeFlag;
    planner.repeatType = userData.repeatType;
    planner.note = userData.note;
    planner.active = true;
    planner.UserId = userId;
    
    await planner.save();
    return planner;
}

const getPlanner = async (userData, userId) => {
    const data =  await Planner.findAll(
        {
            raw: true,
            where: {
                UserId: userId, 
                startDate: {
                    [Op.between]: [
                        moment(userData.startDate)
                        .startOf('day')
                        .format(),
                        moment(userData.endDate)
                        .startOf('day')
                        .format(),
                    ],
                }
            },                
            order: [
                'startDate',
            ],
            attributes: [
                'id',
                'title',
                'startDate',
                'startTime',
                'endDate',
                'endTime',
                'officeFlag',
                'reminderDate',
                'reminderTime',
                'repeatType',
                'attach',
                'location',
                'note',
                'active',
                'UserId',
            ],
        }
    );
    return data;
}


module.exports = {
    savePlanner,
    getPlanner,
}