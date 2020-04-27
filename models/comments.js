/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('comments', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		created: {
			type: DataTypes.DATE
		},
		comment_author_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
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
		tableName: 'comments',
		timestamps: false
	});
};
