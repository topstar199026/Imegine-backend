module.exports = function (sequelize, DataTypes) {
	const Device = sequelize.define('Device', 
		{
			deviceUserId: {type: DataTypes.STRING(11)},
			deviceType: {type: DataTypes.STRING(10)},
			nickName: {type: DataTypes.STRING(255)},
			address: {type: DataTypes.STRING(255)},
			ip: {type: DataTypes.STRING(255)},
			lastTime: {type: DataTypes.DATE},
			public: {type: DataTypes.TEXT},
			active: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
		}, {
			tableName: 'devices',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Device.associate = function (models) {
		Device.belongsTo(models.User);
		Device.hasMany(models.MessagePending);
		Device.hasMany(models.ReadPending);		
	};
	return Device;
};