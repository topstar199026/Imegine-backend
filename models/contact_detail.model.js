module.exports = function (sequelize, DataTypes) {
	const ContactDetail = sequelize.define('ContactDetail', 
		{
			contactKey: {type: DataTypes.INTEGER},
			contactId: {type: DataTypes.STRING(11)},
			contactUserId: {type: DataTypes.INTEGER},
			active: DataTypes.BOOLEAN,
		}, {
			tableName: 'contact_details',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	ContactDetail.associate = function (models) {
	};
	return ContactDetail;
};