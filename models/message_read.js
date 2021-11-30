module.exports = function (sequelize, DataTypes) {
	const MessageRead = sequelize.define('MessageRead', 
		{
			messageId: {type: DataTypes.INTEGER},
			groupId: {type: DataTypes.INTEGER},
			groupUserId: {type: DataTypes.INTEGER},
			userId: {type: DataTypes.STRING(11)},
			readAt: {type: DataTypes.DATE},
			active: DataTypes.BOOLEAN,
		}, {
			tableName: 'message_reads',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	MessageRead.associate = function (models) {
		MessageRead.hasMany(models.ReadPending);
	};
	return MessageRead;
};