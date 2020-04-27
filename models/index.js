const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Post = require('./posts')(sequelize, Sequelize);
db.Photo = require('./photos')(sequelize, Sequelize);
db.Comment = require('./comments')(sequelize, Sequelize);
db.User = require('./users')(sequelize, Sequelize);
db.User_profile = require('./user_profiles')(sequelize, Sequelize);

db.Post.hasMany(db.Photo, { foreignKey: 'post_id', sourceKey: 'id' })
db.Post.hasMany(db.Comment, { foreignKey: 'post_id', sourceKey: 'id' })
db.User.hasMany(db.Comment, { foreignKey: 'comment_author_id', sourceKey: 'id' })
db.User.hasMany(db.Post, { foreignKey: 'post_author_id', sourceKey: 'id' })
db.User.hasMany(db.User_profile, { foreignKey: 'user_id', sourceKey: 'id' })

db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', sourceKey: 'id', onDelete: 'cascade' })
db.Photo.belongsTo(db.Post, { foreignKey: 'post_id', sourceKey: 'id', onDelete: 'cascade' })
db.Comment.belongsTo(db.User, { foreignKey: 'comment_author_id', sourceKey: 'id', onDelete: 'cascade' })
db.Post.belongsTo(db.User, { foreignKey: 'post_author_id', sourceKey: 'id', onDelete: 'cascade' })
db.User_profile.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade' })

module.exports = db;
