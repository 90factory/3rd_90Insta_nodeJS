const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const ip = require('ip');

// const moment = require('moment');
//const validator = require('validator');

const models = require('../models/index.js');
const env = process.env.NODE_ENV || 'jwt_config';
const config = require('../config/config.json')[env];
const router = express.Router();

//multer(이미지 업로드) 관련 설정1
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/') //이미지 저장 경로
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) //이미지 저장명
  } 
});

//multer 관련 설정2
const upload = multer({
  storage : storage,
  fileFilter : function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('이미지만 첨부할 수 있습니다.'))
    }
    callback(null, true);
  }
});


//jwt 검증 미들웨어
router.use('/*', function(req, res, next) {
  const req_token = req.headers.authorization;
  if (!req_token) {
    return res.status(401).send('로그인이 필요합니다.');
  } else { 
      try {
        var decoded = jwt.verify(req_token, config.secretKey);
        console.log('token : ', decoded); //id: 사용자 id(users 테이블 pk), exp: 만료시간
    } catch (err) {
        return res.status(401).send('로그인이 필요합니다.');
    }
  }
  res.decoded = decoded;
  next();
})


//메인 페이지
router.get('/', function(req, res, next) {

  models.Post.findAll({
    include: [{
      model: models.Photo,
      attributes: ['photo']
    }, {
      model: models.User,
      attributes: ['nickname', 'id'],
      include: [{
        model: models.User_profile,
        attributes: ['image'],
      }]
    }, {
      model: models.Comment,
      attributes: ['comment'],
      include: [{
        model: models.User,
        attributes: ['nickname'],
        include: [{
          model: models.User_profile,
          attributes: ['image'],
        }]
      }]
    }],
    order: [['created', 'DESC']],
    attributes: ['id', 'text'],
  })

  .then( result => {
    const url = 'http://' + ip.address() + ':3000/'
    function replacer(key, value) {
      if ( key == 'photo') {
        const imgUrl = url+value;
        return imgUrl;
      }
        return value;
    }
    console.log(JSON.stringify(result, replacer));
    return res.status(200).send(JSON.stringify(result, replacer));
  })
  .catch( err => {
    var data = {message: '피드 조회에 실패했습니다.'};
    return res.status(200).send(JSON.stringify(data));
  })
});


//내 계정 페이지
router.get('/myfeed', function(req, res, next) {
  var user_id = req.connection._httpMessage.req.connection._httpMessage.decoded.id

  models.User.findOne({ 
    where: { id: user_id },
    attributes: ['nickname'],
    include: [{
      model: models.Post,
      attributes: ['id'], 
      include: [{
        model: models.Photo,
        attributes: ['photo'],
        order: [['created', 'DESC']]
      }]
    }],
    order: [['created', 'DESC']]
  })

  .then( result => {
    const url = 'http://' + ip.address() + ':3000/'
    function replacer(key, value) {
      if ( key == 'photo' ) {
        const imgUrl = url+value;
        return imgUrl
      }
      return value
    }
    return res.status(200).send(JSON.stringify(result, replacer));
    })
  .catch( err => {
    var data = {message: '피드 조회에 실패했습니다.'};
    return res.status(404).send(JSON.stringify(data));
  });

});


//타 계정 페이지
router.get('/yourfeed/:id', function(req, res, next) {
  var user_id = req.params.id;
  
  models.User.findOne({
    where: { id: user_id },
    attributes: ['nickname'],
    include: [{
      model: models.Post,
      attributes: ['id'],
      include: [{
        model: models.Photo,
        attributes: ['photo'],
        order: [['created', 'DESC']]
      }]
    }, {
      model: models.User_profile,
      attributes: ['image', 'name', 'intro']
      }]
  })
  .then( result => {
    const url = 'http://' + ip.address() + ':3000/'
    function replacer(key, value) {
      if ( key == 'photo' ) {
        
          const imgUrl = url+value;
          return imgUrl
        }
        return value
      }
      return res.status(200).send(JSON.stringify(result, replacer));
    })

  .catch( err => {
    var data = {message: '피드 조회에 실패했습니다.'};
    return res.status(404).send(JSON.stringify(data));
  });

});


//피드 작성 페이지(POST)
router.post('/', upload.array('imgFile', 3), function(req, res, next) {
  let post_id = '';
  let body = req.body;
  let files = req.files;
  let user_id = req.connection._httpMessage.req.connection._httpMessage.decoded.id;

  if (files.length == 0){
    return res.status(400).send('사진이 첨부되지 않았습니다.');
  }
  models.Post.create({
    text: body.postText,
    post_author_id: user_id
  })

  .then( result => {
    console.log('이미지 파일 정보: ', files);
    post_id = result.id;
    var a = files[0].path.replace(/\\/g, '/'); //여러장 첨부시 반복문 처리 필요함
    for( i = 0; i < files.length; i++ ) {
      models.Photo.create({
        photo: a.replace('public/', ''),
        post_id: post_id
      })
    }
    var data = {message: '피드가 등록되었습니다.'};
    return res.status(200).send(JSON.stringify(data));
  })
  .catch( err => {
    //console.error(err);
    var data = {message: '피드 등록에 실패했습니다.'};
    return res.status(404).send(JSON.stringify(data));
  })
});


//개별 게시물 페이지
router.get('/:id', function(req, res, next) {
  let post_id = req.params.id;
  models.Post.findOne({
    where: { id: post_id },
    include: [{
      model: models.Photo,
      attributes: ['photo']
    }, {
      model: models.User,
      attributes: ['nickname']
    }, {
      model: models.Comment,
      attributes: ['comment', 'created'],
      include: [{
        model: models.User,
        attributes: ['nickname']
      }]
    }],
    attributes: ['text', 'created']
  })

  .then( result => {
    return res.status(200).send(JSON.stringify(result));
  })
  .catch( err => {
    var data = {message: '피드 조회에 실패했습니다.'};
    return res.status(404).send(JSON.stringify(data));
  });
});


//피드 수정(PUT)
router.put('/', function(req, res, next) {
  let post_id = req.params.id;
  let body = req.body;
  models.Post.update({
    text: body.postText
  }, {
    where: { id: post_id }
  })

  .then( result => {
    res.send(JSON.stringify(result));
    console.log(result);
  })
  .catch( err => {
    res.status(400).send('피드 수정에 실패했습니다.');
    console.log('데이터 수정 실패');
  })
});


//피드 삭제(DELETE)
router.delete('/', function(req, res, next) {
  let user_id = req.connection._httpMessage.req.connection._httpMessage.decoded.id;
  let post_id = req.body.post_id;

  models.Post.findOne({
    where: {
      id: post_id
    }
  })

  .then( result => {
    if (result.post_author_id != user_id) {
      return res.status(400).send('피드 작성자만 삭제할 수 있습니다.');
   
    } else {
      let post_id = result.id;
     
      models.Photo.findAll({
        where: {
          post_id: post_id
        },
        attributes: ['photo']
      })
    }
    return result
  })
  .then( result => {

    if (JSON.stringify(result).length == 0) {
      return res.status(404).send('피드가 존재하지 않습니다.');
    }else {
      for ( i = 0; i < result.length; i++) {
        console.log(result[i].photo);
        var file = result[i].photo;
        fs.unlink('./public/' + file, function (err) {
          if (err) throw err;
          console.log('imgFile deleted!');
        })
      }
    }
      models.Photo.destroy({
        where: {post_id: post_id}
      });
      models.Comment.destroy({
        where: {post_id: post_id}
      });
      models.Post.destroy({
        where: {id: post_id}
      });
  })
    
  .then( result => {
    var data = {message: '피드가 삭제되었습니다.'};
    return res.status(201).send(JSON.stringify(data));
  })
  .catch( err => {
    var data = {message: '피드 삭제에 실패했습니다.'};
    return res.status(400).send(JSON.stringify(data));
  });
});

module.exports = router;
