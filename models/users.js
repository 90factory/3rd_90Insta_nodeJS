/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_type: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		password: {
			type: "LONGBLOB",
			allowNull: false
		},
		nickname: {
			type: DataTypes.STRING(30),
			allowNull: false,
			unique: true
		},
		auth: {
			type: DataTypes.INTEGER(1),
			allowNull: false
		},
		created: {
			type: DataTypes.DATE
		},
		updated: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'users',
		timestamps: false
	});
};
