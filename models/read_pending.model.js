module.exports = function (sequelize, DataTypes) {
	const ReadPending = sequelize.define('ReadPending', 
		{
			messageReadId: {type: DataTypes.INTEGER},
		}, {
			tableName: 'read_pendings',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	ReadPending.associate = function (models) {
		ReadPending.belongsTo(models.Device);
		ReadPending.belongsTo(models.MessageRead);
	};
	return ReadPending;
};