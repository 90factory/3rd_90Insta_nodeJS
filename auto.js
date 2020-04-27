const Sequelize = require('sequelize');
const SequelizeAuto = require('sequelize-auto');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

//DB 접속에서 모델 받아옴
const auto = new SequelizeAuto(config.database, config.username, config.password, {
  dialect:"mysql",
  host:"101.101.163.125",
  port:3306,
  pool:{
    max:10,
    min:0,
    idle:100000
  },
});

auto.run((err)=>{
    if(err) throw err;
  });