/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('posts', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		created: {
			type: DataTypes.DATE
		},
		updated: {
			type: DataTypes.DATE,
			allowNull: true
		},
		post_author_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		}
	}, {
		tableName: 'posts',
		timestamps: false,
	});
};
