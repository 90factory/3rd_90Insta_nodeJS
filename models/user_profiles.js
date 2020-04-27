/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_profiles', {
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		intro: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		created: {
			type: DataTypes.DATE
		},
		updated: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'user_profiles',
		timestamps: false
	});
};
