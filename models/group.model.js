module.exports = function (sequelize, DataTypes) {
	const Group = sequelize.define('Group', 
		{
			groupName: {type: DataTypes.STRING(255)},
			groupImage: {type: DataTypes.STRING(255)},
			lastMessage: {type: DataTypes.TEXT},
			newMessage: {
				type: DataTypes.INTEGER,
				default: 0,
			},
			draft: {type: DataTypes.TEXT},
			hashKey: {type: DataTypes.INTEGER},
			memberId: {type: DataTypes.TEXT},
			member: {type: DataTypes.JSONB},
			memberCount: {
				type: DataTypes.INTEGER,
				default: 2,
			},
			private: {
				type: DataTypes.BOOLEAN,
				default: true,
			},
			active: {
				type: DataTypes.BOOLEAN,
				default: true,
			},
			status: {
				type: DataTypes.INTEGER,
			},
		}, {
			tableName: 'groups',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Group.associate = function (models) {
		Group.hasMany(models.GroupDetail);
		Group.belongsTo(models.User);
	};
	return Group;
};