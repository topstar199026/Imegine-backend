var { Op } = require('sequelize');
const moment = require('moment');
const models = require('../../models');
const constants = require('../../constants');
const {Contact, Group, GroupDetail, ContactDetail, User} = models;

const GroupUtil = require('./groupUtil');
const UserUtil = require('./userUtil');

function hashCode (str) {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
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

const getContactByUserId = async (userId, contactId) => {
    return await Contact.findAndCountAll(
        {
            raw: true,
            where: {
                contactId: contactId,
                UserId: userId,
            },
        }
    );
}

const getContactByUserId2 = async (userId, contactId) => {
    return await Contact.findOne(
        {
            raw: true,
            where: {
                contactId: contactId,
                UserId: userId,
            },
        }
    );
}

const getContactList = async (userData, userId) => {
    const data =  await Contact.findAndCountAll(
        {
            raw: true,
            where: 
                userData.flag && userData.flag === true?
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,  
                    isGroup: false,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,   
                    isGroup: false,    
                }
                :
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,    
                },
            order: [
                'contactName',
                'firstName',
                'lastName'
            ],
            attributes: [
                'id',
                'UserId',
                'contactId',
                'contactUserId',
                'contactName',
                'contactImage',
                'firstName',
                'lastName',
                'jobTitle',
                'nickName',
                'address',
                'isGroup',
                'memberId',
                'member',
                'memberCount',
                'groupId',
            ],
        }
    );
    return data;
}

const getContactList3 = async (userData, userId) => {
    const data =  await Contact.findAndCountAll(
        {
            raw: true,
            where: 
                userData.flag && userData.flag === true?
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,  
                    isGroup: false,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,   
                    isGroup: false,    
                }
                :
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,    
                },
            order: [
                'contactName',
                'firstName',
                'lastName'
            ],
            attributes: [
                'id',
                'UserId',
                'contactId',
                'contactUserId',
                'contactName',
                'contactImage',
                'firstName',
                'lastName',
                'jobTitle',
                'nickName',
                'address',
                'isGroup',
                'memberId',
                'member',
                'memberCount',
                'groupId',
            ],
        }
    );
    return data;
}

const getContactList4 = async (userData, userId) => {
    const data =  await Contact.findAll(
        {
            raw: true,
            where: 
                userData.flag && userData.flag === true?
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,  
                    isGroup: false,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,   
                    isGroup: false,    
                }
                :
                userData.searchString && userData.searchString !=='' ?
                {
                    UserId: userId,              
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            lastName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            nickName: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                        {
                            address: {
                                [Op.substring]: userData.searchString,
                            }
                        },
                    ],
                }: {
                    UserId: userId,    
                },
            include: [
                {
                    model: User,
                    as: 'contact_user',
                    required: false,
                    attributes: [
                        'id',
                        'userId',
                        'countryId',
                        'nickName',
                        'avatar',
                    ],
                }
            ],
            order: [
                'nickName',
                'firstName',
                'lastName',
                'contactName'
            ],
            attributes: [
                'id',
                'UserId',
                'contactId',
                'contactUserId',
                'contactName',
                'contactImage',
                'firstName',
                'lastName',
                'jobTitle',
                'nickName',
                'address',
                'isGroup',
                'memberId',
                'member',
                'memberCount',
                'groupId',
            ],
        }
    );
    return data;
}

const saveContact = async (userData, userId, contactUser) => {
    const _user = await UserUtil.getUserById(userId);
    let _userData = {
        sender: {
            userId: _user.userId,
        },
        receiver: {
            contactId: userData.identigier,
        },
        private: true,
    };

    const _group = await GroupUtil.getGroupId(_userData);

    console.log(contactUser);
    const contact = new Contact();
    contact.contactName = contactUser.firstName && contactUser.lastName ? contactUser.firstName + ' ' + contactUser.lastName : null;
    contact.contactImage = contactUser.avatar;
    contact.UserId = userId;
    
    contact.contactId = userData.identigier;
    contact.contactUserId = contactUser.id;
    contact.firstName = contactUser.firstName;
    contact.lastName = contactUser.lastName;
    contact.jobTitle = contactUser.jobTitle;
    contact.nickName = contactUser.nickName;
    contact.address = userData.address;
    contact.active = true;
    contact.isGroup = false;

    contact.memberCount = 1;
    contact.groupId = _group.id;

    await contact.save();
    return contact;
}

const saveGroup = async (userData, id, userId) => {
    console.log(userData,)

    let idArr = [
    ];
    idArr.push(userId);

    for(var i = 0; i < userData.groupContactList.length; i++) {
        var _item = userData.groupContactList[i].item;
        idArr.push(_item.contactId)
    }

    idArr.sort();
    
    let userIdStr = getIdArrayString(idArr);

    let hashKey = hashCode(userIdStr);

    const _group = await GroupUtil.saveGroupId(hashKey, userIdStr, idArr, false, userData.groupName);

    const contact = new Contact();
    contact.contactName = userData.groupName;
    contact.contactImage = null;
    contact.UserId = id;
    
    // contact.contactId = userData.identigier;
    // contact.contactUserId = contactUser.id;
    // contact.firstName = contactUser.firstName;
    // contact.lastName = contactUser.lastName;
    // contact.jobTitle = contactUser.jobTitle;
    // contact.nickName = contactUser.nickName;
    // contact.address = userData.address;
    contact.active = true;
    contact.isGroup = true;

    contact.memberCount = userData.groupContactList.length;
    

    // contact.hashKey = hashKey;
    contact.memberId = userIdStr;
    contact.member = getObjectUserId(idArr);
    contact.groupId = _group.id;


    await contact.save();

    // const group = new Group();
    // group.UserId = userId;
    // group.groupName = userData.groupName;
    // await group.save();
    // console.log(group);

    for(var i = 0; i < userData.groupContactList.length; i++) {
        var _item = userData.groupContactList[i].item;
        console.log(_item);
        const contactDetail = new ContactDetail();
        contactDetail.contactKey = contact.id;
        contactDetail.contactId = _item.contactId;
        contactDetail.contactUserId = _item.contactUserId;
        contactDetail.active = true;
        await contactDetail.save();
    }

    

    return true;
}

module.exports = {
    getContactByUserId,
    getContactByUserId2,
    getContactList,
    getContactList3,
    getContactList4,
	saveContact,
    saveGroup,
}