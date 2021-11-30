module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('User', 
		{
			userId: {type: DataTypes.STRING(11)},
			countryId: {type: DataTypes.STRING(2)},

			avatar: {type: DataTypes.STRING(255)},
			firstName: {type: DataTypes.STRING(50)},
			lastName: {type: DataTypes.STRING(50)},
			jobTitle: {type: DataTypes.STRING(50)},
			nickName: {type: DataTypes.STRING(50)},
			address: {type: DataTypes.STRING(255)},

			password: DataTypes.STRING,
			token: DataTypes.STRING(64),
			tokenCreatedAt: DataTypes.DATE,
			role: DataTypes.STRING(4),
			verified: DataTypes.BOOLEAN,
			accountStatus: DataTypes.STRING(4),
			active: DataTypes.BOOLEAN,
			pwToken: DataTypes.STRING(4),
			pwTokenExpireAt: DataTypes.DATE,
			new_user: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			}
		}, {
			tableName: 'users',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	User.associate = function (models) {
		User.hasMany(models.Group);
		User.hasMany(models.Device);
		User.hasMany(models.Contact);
		User.hasMany(models.Key);
	};
	return User;
};