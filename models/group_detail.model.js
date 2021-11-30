module.exports = function (sequelize, DataTypes) {
	const GroupDetail = sequelize.define('GroupDetail', 
		{
			contactId: {type: DataTypes.STRING(11)},
			contactUserId: {type: DataTypes.INTEGER},
			active: DataTypes.BOOLEAN,
		}, {
			tableName: 'group_details',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	GroupDetail.associate = function (models) {
		GroupDetail.belongsTo(models.Group);
	};
	return GroupDetail;
};