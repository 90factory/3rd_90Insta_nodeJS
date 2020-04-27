const express = require('express');
const models = require("../models/index.js");
const path = require('path');
const env = process.env.NODE_ENV || "jwt_config";
const config = require('../config/config.json')[env];
const jwt = require('jsonwebtoken');

const router = express.Router();

//jwt 검증 미들웨어
router.use('/*', function(req, res, next) {
  const req_token = req.headers.authorization;
  console.log(req_token)
  if (!req_token) {
    res.status(401).send('로그인이 필요합니다.');
  } else {
      try {
      // console.log(config.secretKey);
      // console.log(req_token);
        var decoded = jwt.verify(req_token, config.secretKey);
        console.log("token : ", decoded); //uid: id, iat: 발급시간, exp: 만료시간
    } catch (err) {
        res.status(401).send('로그인이 필요합니다.');
    }
  }
  res.decoded = decoded;
  next();
})


//댓글 작성(POST)-미구현
router.post('/', function(req, res, next) {
    let body = req.body;
    let id = req.connection._httpMessage.req.connection._httpMessage.decoded.id;

    models.Comment.create({
      comment: body.commentText,
      comment_author_id: id,
      post_id: 96 //req.body.id   
    })

    .then( result => {
      res.json(result);
    })
    .catch( err => {
      res.status(401);
      console.log("데이터 추가 실패");
    })
  });  

  //댓글 삭제(DELETE)-미구현
  router.delete('/:id', function(req, res, next) {
    let comment_id = req.params.id;
  
    models.Comment.destroy({
      where: {id: comment_id}
    })
    .then( result => {
      res.json(result);
    })
    .catch( err => {
      res.status(401);
      console.log("데이터 삭제 실패");
    });
  });
  
  module.exports = router;