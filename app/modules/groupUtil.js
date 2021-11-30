var { Op } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {Contact, Group, GroupDetail} = models;

function hashCode (str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function getIdArrayString (arr) {
    let str = '';
    for(var i=0; i<arr.length; i++) {
        console.log(arr[i])
        let _s = i===0 ? '': ',';
        str = str + _s + arr[i];
    }
    return str;
}

function getObjectUserId (arr) {
    const _t = {};
    for(var i=0; i<arr.length; i++) {
        _t['user' + i.toString()] = arr[i];
    }
    return _t;
}

const getGroupIdById = async (groupId = null) => {
    return await Group.findOne(
        {
            raw: true,
            where: {
                id: groupId
            }
        }
    );
}


const getGroupIdByUserId = async (hashKey, memberId, private, groupId = null) => {
    const data = await Group.findAll(
        {
            raw: true,
            where: 
            private ?
            {
                hashKey: hashKey,   
                private: private,
                memberId: memberId,
            }
            :
            {
                contactId: groupId,   
                private: private,
            },
        }
    );
    if(data && data.length === 1) return data[0]; else return null;
}

const saveGroupId = async (hashKey, memberId, idArr, private, groupName = '') => {
    const group = new Group();
    group.groupName = groupName;
    group.groupImage = '';
    group.lastMessage = '';
    group.draft = '';
    group.newMessage = 0;
    group.hashKey = hashKey;
    group.memberId = memberId;
    group.member = getObjectUserId(idArr);
    group.memberCount = idArr.length;;
    group.private = private;
    group.active = true;
    group.status = 0;
    await group.save();
    return group;
}

const getGroupId = async (userData) => {
    let private = userData.private;
    let groupId = userData.groupId;
    let idArr = [
        userData.sender.userId,
        userData.receiver.contactId,
    ];
    idArr.sort();

    let userIdStr = getIdArrayString(idArr);

    // console.log('userIdStr', userData, idArr, userIdStr)

    let hashKey = hashCode(userIdStr);

    let _groupId;
    if(groupId) {
        _groupId = await getGroupIdById(groupId);
    }else{
        _groupId = await getGroupIdByUserId(hashKey, userIdStr, private);
        if(_groupId) {}
        else {
            await saveGroupId(hashKey, userIdStr, idArr, private)
            _groupId = await getGroupIdByUserId(hashKey, userIdStr, private);
        }
    }

    return _groupId;    
}

module.exports = {
    getGroupId,
    getGroupIdById,
    saveGroupId,
}