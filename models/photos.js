/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('photos', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		photo: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		created: {
			type: DataTypes.DATE
		},
		post_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'posts',
				key: 'id'
			}
		}
	}, {
		tableName: 'photos',
		timestamps: false
	});
};
