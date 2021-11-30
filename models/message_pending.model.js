module.exports = function (sequelize, DataTypes) {
	const MessagePending = sequelize.define('MessagePending', 
		{
			key: {type: DataTypes.TEXT},
			readAt: {type: DataTypes.DATE},
			readBy: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
			editAt: {type: DataTypes.DATE},
			editBy: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
			deleteAt: {type: DataTypes.DATE},
			deleteBy: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
		}, {
			tableName: 'message_pendings',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	MessagePending.associate = function (models) {
		MessagePending.belongsTo(models.Message);
		MessagePending.belongsTo(models.Device);
	};
	return MessagePending;
};