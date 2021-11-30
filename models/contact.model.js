module.exports = function (sequelize, DataTypes) {
	const Contact = sequelize.define('Contact', 
		{
			contactName: {type: DataTypes.STRING(255)},
			firstName: {type: DataTypes.STRING(50)},
			lastName: {type: DataTypes.STRING(50)},
			contactId: {type: DataTypes.STRING(11)},
			// contactUserId: {type: DataTypes.INTEGER},
			contactImage: {type: DataTypes.STRING(255)},
			jobTitle: {type: DataTypes.STRING(50)},
			nickName: {type: DataTypes.STRING(50)},
			address: {type: DataTypes.STRING(255)},
			active: DataTypes.BOOLEAN,
			isGroup: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
			memberId: {type: DataTypes.TEXT},
			member: {type: DataTypes.JSONB},
			memberCount: {
				type: DataTypes.INTEGER,
				default: 1,
			},
			groupId: {type: DataTypes.STRING(11)},
		}, {
			tableName: 'contacts',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Contact.associate = function (models) {
		Contact.belongsTo(models.User);
		Contact.belongsTo(models.User, { as: 'contact_user' });
	};
	return Contact;
};