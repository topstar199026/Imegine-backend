module.exports = function (sequelize, DataTypes) {
	const Planner = sequelize.define('Planner', 
		{
			title: {type: DataTypes.STRING(255)},
			startDate: {type: DataTypes.DATEONLY},
			startTime: {type: DataTypes.TIME},
			endDate: {type: DataTypes.DATEONLY},
			endTime: {type: DataTypes.TIME},
			officeFlag: {
				type: DataTypes.BOOLEAN,
				default: true,
			},
			reminderDate: {type: DataTypes.DATEONLY},
			reminderTime: {type: DataTypes.TIME},
			repeatType: {type: DataTypes.STRING(10)},
			attach: {type: DataTypes.STRING(255)},
			location: {type: DataTypes.STRING(255)},
			note: {type: DataTypes.TEXT},
			active: {
				type: DataTypes.BOOLEAN,
				default: false,
			},
		}, {
			tableName: 'planners',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			timestamps: true,
			underscored: true,
			classMethods: {
			}
		}
	);

	Planner.associate = function (models) {
		Planner.belongsTo(models.User);
	};
	return Planner;
};