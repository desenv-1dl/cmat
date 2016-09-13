(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var bodyParser = require('body-parser');
  var cors = require('cors');

  // create application/json parser
  var jsonParser = bodyParser.json();

  //Javascript com operações de banco
  var operations = require('../src/operations');

  //CORS middleware
  router.use(cors({
    exposedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Link, Location',
  }));

  // router.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  router.get('/equipamentos', function (req, res, next) {
    operations.getEquipamentos(req, res, next);
  });

  router.get('/cautelas', function (req, res, next) {
    operations.getCautelas(req, res, next);
  });

  router.get('/cautelas/:id', function (req, res, next) {
    operations.getCautelasByEquipId(req, res, req.params.id, next);
  });

  router.get('/manutencoes', function (req, res, next) {
    operations.getManutencoes(req, res, next);
  });

  router.get('/manutencoes/:id', function (req, res, next) {
    operations.getManutencoesByEquipId(req, res, req.params.id, next);
  });

  module.exports = router;
})();
