module.exports = function (sequelize, DataTypes) {
	const Key = sequelize.define('Key', 
		{
			userId: {type: DataTypes.STRING(11)},
			key: {type: DataTypes.STRING(2048)},
		}, {
			tableName: 'keys',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Key.associate = function (models) {
		Key.belongsTo(models.User);
	};
	return Key;
};