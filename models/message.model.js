module.exports = function (sequelize, DataTypes) {
	const Message = sequelize.define('Message', 
		{
			senderId: {type: DataTypes.INTEGER},
			receiverId: {type: DataTypes.INTEGER},
			message: {type: DataTypes.TEXT},
			messageType: {
				type: DataTypes.INTEGER,
				default: 0,
			},
			// member: {type: DataTypes.JSONB},
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
			tableName: 'messages',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Message.associate = function (models) {
		Message.hasMany(models.MessagePending);
	};
	return Message;
};